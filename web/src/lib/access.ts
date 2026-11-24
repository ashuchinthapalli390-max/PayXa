import "server-only";
import { getSupabaseAdmin } from "./supabase";
import { ADMIN_CONSOLE_URL, checkAdminAuthorization, checkPlatformAdmin } from "./sso";
import { DASHBOARD_URL } from "./dashboard-url";

/**
 * Role & access resolution after a PayXa website login.
 * Source of truth is the shared Supabase database (same as payxa-api):
 *   - platform staff:  admin_sso_identities → admin_roles
 *   - merchant users:  merchant_members (+ merchants.status)
 */

export type MerchantRole = "OWNER" | "ADMINISTRATOR" | "DEVELOPER" | "FINANCE" | "VIEWER";
export type MerchantStatus = "DRAFT" | "PENDING_REVIEW" | "ACTIVE" | "RESTRICTED" | "SUSPENDED" | "REJECTED";

export type Membership = {
  merchantId: string;
  businessName: string;
  role: MerchantRole;
  status: MerchantStatus;
};

export type Access = {
  admin: { role: string; console: "platform" | "legacy" } | null;
  memberships: Membership[];
  pendingInvites: number;
  /** false when the database could not be reached; callers fall back to the dashboard's own checks */
  resolved: boolean;
};

const roleRank: Record<MerchantRole, number> = { OWNER: 0, ADMINISTRATOR: 1, DEVELOPER: 2, FINANCE: 3, VIEWER: 4 };

export async function resolveAccess(email: string): Promise<Access> {
  const empty: Access = { admin: null, memberships: [], pendingInvites: 0, resolved: false };
  if (!email) return { ...empty, resolved: true };
  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    return empty;
  }

  const [legacyAdmin, platformAdmin, members] = await Promise.all([
    checkAdminAuthorization(email),
    checkPlatformAdmin(email),
    supabase
      .from("merchant_members")
      .select("merchant_id, role, invitation_status, merchants!inner(business_name, status, deleted_at)")
      // Case-insensitive exact match: escape LIKE wildcards so "a_b@x.com" can't match "aXb@x.com".
      .ilike("email", email.trim().toLowerCase().replace(/[\\%_]/g, (c) => `\\${c}`)),
  ]);

  // admin.payxa.in (platform_admins) takes precedence over the legacy api.payxa.in/dash console.
  const admin: Access["admin"] = platformAdmin
    ? { role: platformAdmin.role === "owner" ? "OWNER_ADMIN" : "PLATFORM_ADMIN", console: "platform" }
    : legacyAdmin.isAuthorized
      ? { role: legacyAdmin.role ?? "ADMIN", console: "legacy" }
      : null;

  if (members.error) {
    console.error("[payxa] access lookup failed", members.error.message);
    return { ...empty, admin };
  }

  type Row = {
    merchant_id: string;
    role: MerchantRole;
    invitation_status: string;
    merchants: { business_name: string; status: MerchantStatus; deleted_at: string | null } | { business_name: string; status: MerchantStatus; deleted_at: string | null }[];
  };
  const rows = (members.data ?? []) as Row[];
  const memberships: Membership[] = [];
  let pendingInvites = 0;
  for (const r of rows) {
    const m = Array.isArray(r.merchants) ? r.merchants[0] : r.merchants;
    if (!m || m.deleted_at) continue;
    if (r.invitation_status === "PENDING") pendingInvites++;
    if (r.invitation_status !== "ACCEPTED") continue;
    memberships.push({ merchantId: r.merchant_id, businessName: m.business_name, role: r.role, status: m.status });
  }
  memberships.sort((a, b) => roleRank[a.role] - roleRank[b.role]);

  return {
    admin,
    memberships,
    pendingInvites,
    resolved: true,
  };
}

/** Where a merchant member lands in the dashboard, by role and workspace status. */
export function merchantLanding(m: Membership): string {
  if (m.status === "DRAFT" || m.status === "PENDING_REVIEW") return "/guide";
  switch (m.role) {
    case "DEVELOPER":
      return "/developers";
    case "FINANCE":
      return "/payments";
    default:
      return "/";
  }
}

export const isBlocked = (m: Membership) => m.status === "SUSPENDED" || m.status === "REJECTED";

export const dashboardUrl = (path: string) => `${DASHBOARD_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Legacy api.payxa.in/dash entry: Turnstile + the signed one-time SSO ticket. */
export const ADMIN_ENTRY = "/api/sso/dash/authorize?dest=/dash";

/**
 * Where an admin goes after login. Platform admins start on admin.payxa.in/auth/start, which sets
 * the state cookie and comes straight back to /api/sso/admin/authorize (Turnstile → ticket → MFA).
 */
export function adminEntry(admin: Access["admin"]): string {
  return admin?.console === "platform" ? `${ADMIN_CONSOLE_URL}/auth/start` : ADMIN_ENTRY;
}

import "server-only";
import { getSupabaseAdmin } from "./supabase";
import { checkAdminAuthorization } from "./sso";
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
  admin: { role: string } | null;
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

  const [admin, members] = await Promise.all([
    checkAdminAuthorization(email),
    supabase
      .from("merchant_members")
      .select("merchant_id, role, invitation_status, merchants!inner(business_name, status, deleted_at)")
      .ilike("email", email.trim().toLowerCase()),
  ]);

  if (members.error) {
    console.error("[payxa] access lookup failed", members.error.message);
    return { ...empty, admin: admin.isAuthorized ? { role: admin.role ?? "ADMIN" } : null };
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
    admin: admin.isAuthorized ? { role: admin.role ?? "ADMIN" } : null,
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

/** Admin console entry: goes through Turnstile + the signed one-time SSO ticket. */
export const ADMIN_ENTRY = "/api/sso/dash/authorize?dest=/dash";

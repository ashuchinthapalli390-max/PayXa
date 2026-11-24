import "server-only";
import { getSupabaseAdmin } from "./supabase";

/**
 * Computes SHA-256 hex digest of string.
 */
export async function sha256Hex(data: string): Promise<string> {
  const enc = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Signs message with HMAC-SHA256.
 */
async function hmacSign(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Generates and stores a short-lived, single-use SSO authorization ticket.
 * Enforces 60-second TTL and HMAC signature.
 */
export async function issueSSOTicket(params: {
  adminUserId: string;
  role: string;
  permissions: string[];
  email: string;
  destination: string;
  state: string;
}): Promise<string> {
  const { adminUserId, role, permissions, email, destination, state } = params;
  const sharedSecret = process.env.DASH_SSO_SHARED_SECRET;
  if (!sharedSecret) throw new Error("DASH_SSO_SHARED_SECRET is not configured");

  const ticketId = crypto.randomUUID();
  const now = Date.now();
  const message = `${ticketId}.${now}.${state}`;
  const sig = await hmacSign(message, sharedSecret);
  const ticketString = `${ticketId}.${now}.${state}.${sig}`;

  const ticketHash = await sha256Hex(ticketString);
  const expiresAt = new Date(now + 60 * 1000).toISOString(); // 60s expiration

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("admin_sso_tickets").insert({
    ticket_hash: ticketHash,
    admin_user_id: adminUserId,
    admin_role: role,
    permissions,
    email,
    destination: destination || "/dash",
    state,
    expires_at: expiresAt
  });

  if (error) {
    throw new Error(`Failed to issue SSO ticket: ${error.message}`);
  }

  return ticketString;
}

/** admin.payxa.in — the restricted platform admin console. */
export const ADMIN_CONSOLE_URL = (process.env.ADMIN_CONSOLE_URL || "https://admin.payxa.in").replace(/\/+$/, "");

/**
 * admin.payxa.in identity check: an ACTIVE row in platform_admins whose email equals the verified
 * login email. This only decides whether to issue a ticket; the API re-checks the row, the
 * server allowlist and MFA before any admin data is served.
 */
export async function checkPlatformAdmin(email: string): Promise<{ userId: string; role: "owner" | "platform_admin" } | null> {
  const normalized = email?.trim().toLowerCase();
  if (!normalized) return null;
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("platform_admins")
      .select("user_id, role, status")
      .eq("email", normalized)
      .eq("status", "active")
      .maybeSingle();
    if (error || !data) return null;
    return { userId: data.user_id as string, role: data.role as "owner" | "platform_admin" };
  } catch (err) {
    console.error("checkPlatformAdmin error:", err);
    return null;
  }
}

/** State minted by admin.payxa.in/auth/start: base64url, 32–128 chars. */
export function isValidAdminState(state: string | null | undefined): state is string {
  return typeof state === "string" && /^[A-Za-z0-9_-]{32,128}$/.test(state);
}

/**
 * Checks whether an authenticated email is mapped to an active platform administrator.
 * (Legacy api.payxa.in/dash diagnostics console.)
 */
export async function checkAdminAuthorization(email: string): Promise<{
  isAuthorized: boolean;
  adminUserId?: string;
  role?: string;
  permissions?: string[];
}> {
  if (!email) return { isAuthorized: false };

  try {
    const supabase = getSupabaseAdmin();

    // Query admin_sso_identities joined with admin_roles
    const { data, error } = await supabase
      .from("admin_sso_identities")
      .select("admin_id, is_active, admin_roles(user_id, role, permissions)")
      // Case-insensitive exact match: escape LIKE wildcards so look-alike emails can't match an admin.
      .ilike("email", email.trim().toLowerCase().replace(/[\\%_]/g, (c) => `\\${c}`))
      .eq("is_active", true)
      .limit(1);

    if (error || !data || data.length === 0) {
      return { isAuthorized: false };
    }

    const row = data[0] as { admin_roles?: { user_id?: string; role?: string; permissions?: string[] } | null };
    const adminRole = row.admin_roles;

    if (!adminRole || !adminRole.user_id) {
      return { isAuthorized: false };
    }

    return {
      isAuthorized: true,
      adminUserId: adminRole.user_id,
      role: adminRole.role,
      permissions: adminRole.permissions || ["*"]
    };
  } catch (err) {
    console.error("checkAdminAuthorization error:", err);
    return { isAuthorized: false };
  }
}

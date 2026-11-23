/**
 * The merchant dashboard is its own app on a subdomain (PayXa DashBoard).
 * Dashboard: https://dash.payxa.in (set NEXT_PUBLIC_DASHBOARD_URL to override)
 * This site no longer hosts a dashboard of its own.
 */
export const DASHBOARD_URL = (process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dash.payxa.in").replace(/\/+$/, "");
export const DASHBOARD_ORIGIN = new URL(DASHBOARD_URL).origin;

/** After login everyone goes through the role router, which picks the right destination. */
export const CONTINUE_PATH = "/continue";

/**
 * Post-login redirect allow-list: same-site relative paths, or absolute URLs on the
 * dashboard subdomain only. Anything else (open-redirect attempts) → the role router.
 */
export function resolveCallback(v: unknown): string {
  const s = typeof v === "string" ? v : "";
  if (s.startsWith("/") && !s.startsWith("//") && !s.startsWith("/\\")) {
    // Old /dashboard links: let the role router decide where this person belongs.
    if (s === "/dashboard" || s.startsWith("/dashboard/")) return CONTINUE_PATH;
    return s;
  }
  try {
    const u = new URL(s);
    // A dashboard deep link is honoured only after the role check (access-based).
    if (u.origin === DASHBOARD_ORIGIN) return `${CONTINUE_PATH}?next=${encodeURIComponent(u.pathname + u.search)}`;
  } catch {
    /* not a URL */
  }
  return CONTINUE_PATH;
}

/**
 * The merchant dashboard runs as its own app on a subdomain (e.g. https://dashboard.payxa.com).
 * When NEXT_PUBLIC_DASHBOARD_URL is unset, the built-in /dashboard is used instead.
 */
export const DASHBOARD_URL = (process.env.NEXT_PUBLIC_DASHBOARD_URL || "").replace(/\/+$/, "");
export const DASHBOARD_ORIGIN = DASHBOARD_URL ? new URL(DASHBOARD_URL).origin : null;

/** Where to land after login when no callback was given. */
export const dashboardHome = DASHBOARD_URL ? `${DASHBOARD_URL}/` : "/dashboard";

/**
 * Post-login redirect allow-list: same-site relative paths, or absolute URLs on
 * the dashboard subdomain only. Anything else (open redirect attempts) → dashboard home.
 */
export function resolveCallback(v: unknown): string {
  const s = typeof v === "string" ? v : "";
  if (s.startsWith("/") && !s.startsWith("//") && !s.startsWith("/\\")) {
    // Old /dashboard links go to the subdomain when it's configured.
    if (DASHBOARD_URL && (s === "/dashboard" || s.startsWith("/dashboard/"))) return `${DASHBOARD_URL}${s.slice("/dashboard".length) || "/"}`;
    return s;
  }
  if (DASHBOARD_ORIGIN) {
    try {
      const u = new URL(s);
      if (u.origin === DASHBOARD_ORIGIN) return u.toString();
    } catch {
      /* not a URL */
    }
  }
  return dashboardHome;
}

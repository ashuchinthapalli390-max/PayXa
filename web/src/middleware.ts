import { NextResponse, type NextMiddleware } from "next/server";
import { auth, authConfigured } from "@/auth";
import { DASHBOARD_URL } from "@/lib/dashboard-url";

const protect = auth((req) => {
  if (!req.auth?.user) {
    const url = new URL("/login", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
}) as unknown as NextMiddleware;

/**
 * /dashboard on this site:
 *  - If the dashboard subdomain is configured, permanently hand off to it (it does its own login + Cloudflare checks).
 *  - Otherwise guard the built-in dashboard. If auth isn't configured, show a friendly login notice.
 */
export const middleware: NextMiddleware = (req, ev) => {
  if (DASHBOARD_URL) {
    const rest = req.nextUrl.pathname.slice("/dashboard".length) || "/";
    return NextResponse.redirect(`${DASHBOARD_URL}${rest}${req.nextUrl.search}`, 308);
  }
  if (!authConfigured) return NextResponse.redirect(new URL("/login?error=Configuration", req.nextUrl.origin));
  return protect(req, ev);
};

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};

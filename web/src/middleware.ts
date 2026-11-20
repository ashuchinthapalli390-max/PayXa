import { NextResponse, type NextMiddleware } from "next/server";
import { auth, authConfigured } from "@/auth";

const protect = auth((req) => {
  if (!req.auth?.user) {
    const url = new URL("/login", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
}) as unknown as NextMiddleware;

/** Guards /dashboard. If auth isn't configured on this server, send people to a friendly login notice. */
export const middleware: NextMiddleware = (req, ev) => {
  if (!authConfigured) return NextResponse.redirect(new URL("/login?error=Configuration", req.nextUrl.origin));
  return protect(req, ev);
};

export const config = {
  matcher: ["/dashboard/:path*"],
};

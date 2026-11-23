import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/auth";
import { checkAdminAuthorization, issueSSOTicket } from "@/lib/sso";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  let dest = searchParams.get("dest") || "/dash";
  if (!dest.startsWith("/dash") || dest.startsWith("//")) {
    dest = "/dash";
  }

  // 1. Verify Main Website Auth.js Session
  const session = await getSession();
  if (!session?.user?.email) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Verify Turnstile Security Verification for this SSO attempt
  const ssoVerifiedCookie = req.cookies.get("pxa_sso_verified")?.value;
  if (!ssoVerifiedCookie) {
    // Show security check page on the main website
    const verifyUrl = new URL("/sso/verify", req.nextUrl.origin);
    verifyUrl.searchParams.set("dest", dest);
    return NextResponse.redirect(verifyUrl);
  }

  // 3. Verify Administrator Privileges in Database
  const adminCheck = await checkAdminAuthorization(session.user.email);
  if (!adminCheck.isAuthorized || !adminCheck.adminUserId) {
    // Access Denied: Merchant account or unmapped user is trying to access Central Admin
    const deniedUrl = new URL("/sso/access-denied", req.nextUrl.origin);
    deniedUrl.searchParams.set("email", session.user.email);
    return NextResponse.redirect(deniedUrl);
  }

  // 4. Issue Cryptographically Signed, Short-Lived One-Time Ticket (60s)
  const state = crypto.randomUUID();
  let ticket: string;
  try {
    ticket = await issueSSOTicket({
      adminUserId: adminCheck.adminUserId,
      role: adminCheck.role || "ADMIN",
      permissions: adminCheck.permissions || ["*"],
      email: session.user.email,
      destination: dest,
      state
    });
  } catch (err: any) {
    console.error("SSO ticket issuance error:", err);
    return NextResponse.json({ error: "Failed to issue SSO ticket." }, { status: 500 });
  }

  // 5. Construct Callback URL on the API Backend
  const apiBase = (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "https://payxa-api.payxa.workers.dev").replace(/\/+$/, "");
  const callbackUrl = new URL("/dash/auth/callback", apiBase);
  callbackUrl.searchParams.set("ticket", ticket);
  callbackUrl.searchParams.set("state", state);

  // Consume/clear the single-use SSO verification cookie
  const res = NextResponse.redirect(callbackUrl, 302);
  res.cookies.set("pxa_sso_verified", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax"
  });
  res.headers.set("Cache-Control", "no-store, max-age=0");

  return res;
}

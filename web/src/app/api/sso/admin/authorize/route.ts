import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/auth";
import { ADMIN_CONSOLE_URL, checkPlatformAdmin, isValidAdminState, issueSSOTicket } from "@/lib/sso";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * payxa.in → admin.payxa.in handoff.
 *
 * GET /api/sso/admin/authorize?state=<value set as a cookie by admin.payxa.in/auth/start>
 *  1. requires a verified payxa.in login (Google or email one-time code)
 *  2. requires a fresh Cloudflare Turnstile check
 *  3. requires an active platform_admins row for the login email
 *  4. issues a 60-second, single-use ticket bound to `state`, destination "admin-console"
 * admin.payxa.in exchanges the ticket server-to-server; MFA happens there before any access.
 */
export async function GET(req: NextRequest) {
  const state = req.nextUrl.searchParams.get("state");
  const noStore = (res: NextResponse) => {
    res.headers.set("Cache-Control", "no-store, max-age=0");
    return res;
  };

  if (!isValidAdminState(state)) {
    // Every admin sign-in must start on admin.payxa.in so the state cookie exists there.
    return noStore(NextResponse.redirect(`${ADMIN_CONSOLE_URL}/auth/signin?error=start_again`));
  }

  const session = await getSession();
  const email = session?.user?.email;
  if (!email) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", `/api/sso/admin/authorize?state=${state}`);
    return noStore(NextResponse.redirect(loginUrl));
  }

  if (!req.cookies.get("pxa_sso_verified")?.value) {
    const verifyUrl = new URL("/sso/verify", req.nextUrl.origin);
    verifyUrl.searchParams.set("target", "admin");
    verifyUrl.searchParams.set("state", state);
    return noStore(NextResponse.redirect(verifyUrl));
  }

  const admin = await checkPlatformAdmin(email);
  if (!admin) {
    // No email in the URL and no hint about who the admins are.
    return noStore(NextResponse.redirect(new URL("/sso/access-denied", req.nextUrl.origin)));
  }

  let ticket: string;
  try {
    ticket = await issueSSOTicket({
      adminUserId: admin.userId,
      role: admin.role,
      permissions: [],
      email: email.trim().toLowerCase(),
      destination: "admin-console",
      state,
    });
  } catch (err) {
    console.error("Admin console ticket issuance failed:", err);
    return noStore(NextResponse.json({ error: "Unable to start the admin sign-in. Try again." }, { status: 500 }));
  }

  const callback = new URL("/auth/callback", ADMIN_CONSOLE_URL);
  callback.searchParams.set("ticket", ticket);
  callback.searchParams.set("state", state);
  const res = NextResponse.redirect(callback, 302);
  res.cookies.set("pxa_sso_verified", "", { path: "/", maxAge: 0, httpOnly: true, sameSite: "lax" });
  res.headers.set("Referrer-Policy", "no-referrer");
  return noStore(res);
}

import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/auth";
import { verifyTurnstile } from "@/lib/turnstile";
import { isValidAdminState } from "@/lib/sso";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Session expired. Please log in again." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const token = typeof body.token === "string" ? body.token : "";
  let dest = typeof body.dest === "string" ? body.dest : "/dash";
  if (!dest.startsWith("/dash") || dest.startsWith("//")) {
    dest = "/dash";
  }

  if (!token || token.length < 10) {
    return NextResponse.json({ error: "Missing Turnstile verification token." }, { status: 400 });
  }

  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  const result = await verifyTurnstile(token, ip, "admin-sso");
  if (!result.ok) {
    return NextResponse.json({
      error: `Security verification failed: ${result.reason}. Please try again.`
    }, { status: 403 });
  }

  // admin.payxa.in sign-ins continue to the admin-console authorize step with their state.
  const adminState = body.target === "admin" && isValidAdminState(body.state) ? body.state : null;

  // Verification passed! Set short-lived SSO verification gate cookie
  const res = NextResponse.json({
    ok: true,
    redirect: adminState
      ? `/api/sso/admin/authorize?state=${adminState}`
      : `/api/sso/dash/authorize?dest=${encodeURIComponent(dest)}`
  });

  const isHttps = req.nextUrl.protocol === "https:";
  res.cookies.set("pxa_sso_verified", "true", {
    httpOnly: true,
    secure: isHttps,
    sameSite: "lax",
    path: "/",
    maxAge: 300 // 5 minutes validity to complete authorization
  });
  res.headers.set("Cache-Control", "no-store, max-age=0");

  return res;
}

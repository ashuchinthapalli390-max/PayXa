import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/auth";
import SSOVerifyGate from "./SSOVerifyGate";
import { isValidAdminState } from "@/lib/sso";

export const metadata: Metadata = {
  title: "Admin Security Verification - PayXa"
};

export const dynamic = "force-dynamic";

export default async function SSOVerifyPage({
  searchParams
}: {
  searchParams: Promise<{ dest?: string; target?: string; state?: string }>;
}) {
  const { dest, target, state } = await searchParams;
  const adminState = target === "admin" && isValidAdminState(state) ? state : undefined;
  const session = await getSession();

  if (!session?.user?.email) {
    const next = adminState ? `/api/sso/admin/authorize?state=${adminState}` : "/api/sso/dash/authorize?dest=" + (dest || "/dash");
    redirect(`/login?callbackUrl=${encodeURIComponent(next)}`);
  }

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || process.env.TURNSTILE_SITE_KEY || "0x4AAAAAAGOZqQ1lav7mTcrR";

  return (
    <SSOVerifyGate
      siteKey={siteKey}
      email={session.user.email}
      dest={dest || "/dash"}
      adminState={adminState}
    />
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/auth";
import SSOVerifyGate from "./SSOVerifyGate";

export const metadata: Metadata = {
  title: "Admin Security Verification - PayXa"
};

export const dynamic = "force-dynamic";

export default async function SSOVerifyPage({
  searchParams
}: {
  searchParams: Promise<{ dest?: string }>;
}) {
  const { dest } = await searchParams;
  const session = await getSession();

  if (!session?.user?.email) {
    const loginUrl = `/login?callbackUrl=${encodeURIComponent("/api/sso/dash/authorize?dest=" + (dest || "/dash"))}`;
    redirect(loginUrl);
  }

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || process.env.TURNSTILE_SITE_KEY || "0x4AAAAAAGOZqQ1lav7mTcrR";

  return (
    <SSOVerifyGate
      siteKey={siteKey}
      email={session.user.email}
      dest={dest || "/dash"}
    />
  );
}

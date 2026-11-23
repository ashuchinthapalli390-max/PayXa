import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/ui/AuthShell";
import { getSession, googleEnabled } from "@/auth";
import { resolveCallback } from "@/lib/dashboard-url";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; error?: string }> }) {
  const { callbackUrl, error } = await searchParams;
  // Only same-site paths or the dashboard subdomain are allowed (no open redirects).
  const cb = resolveCallback(callbackUrl);
  const session = await getSession();
  if (session?.user) redirect(cb);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined;
  return <AuthShell mode="login" googleEnabled={googleEnabled} callbackUrl={cb} error={error} siteKey={siteKey} />;
}

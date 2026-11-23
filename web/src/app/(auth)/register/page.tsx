import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/ui/AuthShell";
import { getSession, googleEnabled, testLoginEnabled } from "@/auth";
import { dashboardHome } from "@/lib/dashboard-url";

export const metadata: Metadata = { title: "Get started" };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const session = await getSession();
  if (session?.user) redirect(dashboardHome);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAGOZqQ1lav7mTcrR";
  return <AuthShell mode="register" googleEnabled={googleEnabled} testLoginEnabled={testLoginEnabled} callbackUrl={dashboardHome} error={error} siteKey={siteKey} />;
}

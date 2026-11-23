import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/ui/AuthShell";
import { getSession, googleEnabled } from "@/auth";
import { CONTINUE_PATH } from "@/lib/dashboard-url";

export const metadata: Metadata = { title: "Create account" };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const session = await getSession();
  if (session?.user) redirect(CONTINUE_PATH);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined;
  return <AuthShell mode="register" googleEnabled={googleEnabled} callbackUrl={CONTINUE_PATH} error={error} siteKey={siteKey} />;
}

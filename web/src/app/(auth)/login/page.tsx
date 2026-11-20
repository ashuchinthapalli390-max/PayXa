import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/ui/AuthShell";
import { getSession, googleEnabled, testLoginEnabled } from "@/auth";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; error?: string }> }) {
  const { callbackUrl, error } = await searchParams;
  const session = await getSession();
  if (session?.user) redirect("/dashboard");
  const cb = callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/dashboard";
  return <AuthShell mode="login" googleEnabled={googleEnabled} testLoginEnabled={testLoginEnabled} callbackUrl={cb} error={error} />;
}

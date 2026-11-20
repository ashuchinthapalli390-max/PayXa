import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/ui/AuthShell";
import { auth, googleEnabled, testLoginEnabled } from "@/auth";

export const metadata: Metadata = { title: "Get started" };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const session = await auth();
  if (session?.user) redirect("/dashboard");
  return <AuthShell mode="register" googleEnabled={googleEnabled} testLoginEnabled={testLoginEnabled} callbackUrl="/dashboard" error={error} />;
}

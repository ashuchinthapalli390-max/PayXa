import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/ui/AuthShell";
import { Field, PreviewForm } from "@/components/ui/Forms";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Log in to your PayXa merchant workspace.">
      <PreviewForm
        submitLabel="Log in"
        notice="Merchant sign-in opens at launch. Your details were not sent or stored."
      >
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field label="Password" name="password" type="password" autoComplete="current-password" required />
      </PreviewForm>
      <p className="mt-6 text-center text-[14px] text-muted">
        New to PayXa?{" "}
        <Link href="/register" className="text-neon hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

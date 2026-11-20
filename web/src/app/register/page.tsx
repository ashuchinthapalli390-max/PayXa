import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/ui/AuthShell";
import { Field, PreviewForm } from "@/components/ui/Forms";

export const metadata: Metadata = { title: "Get started" };

export default function RegisterPage() {
  return (
    <AuthShell title="Start with PayXa" subtitle="Free sandbox. ₹0 PayXa platform fee on the proposed Starter plan.">
      <PreviewForm
        submitLabel="Join the sandbox waitlist"
        notice="Thanks! Merchant registration opens at launch. Your details were not sent or stored."
      >
        <Field label="Business name" name="business" autoComplete="organization" required />
        <Field label="Work email" name="email" type="email" autoComplete="email" required />
        <Field label="Website (optional)" name="website" type="url" placeholder="https://" />
      </PreviewForm>
      <p className="mt-6 text-center text-[13px] text-dim">
        By continuing you agree to the{" "}
        <Link href="/legal/terms" className="text-muted underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/legal/privacy" className="text-muted underline">
          Privacy policy
        </Link>
        .
      </p>
      <p className="mt-3 text-center text-[14px] text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-neon hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}

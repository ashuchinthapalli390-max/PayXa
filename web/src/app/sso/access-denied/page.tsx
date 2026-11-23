import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, LayoutDashboard, LogOut } from "lucide-react";
import { signOutAction } from "@/app/(auth)/actions";

export const metadata: Metadata = {
  title: "Access Denied - PayXa Admin SSO"
};

export default async function AccessDeniedPage({
  searchParams
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="relative flex min-h-[100svh] items-center justify-center px-4 py-16 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_40%,rgba(180,30,30,0.2),transparent_65%)]" />

      <div className="w-full max-w-[480px] rounded-3xl border border-white/10 bg-[#0f0e12]/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-amber-500/15 text-amber-400">
            <ShieldAlert size={26} />
          </span>
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-dim uppercase">Security Enforcement</div>
            <h1 className="text-[20px] font-semibold text-paper tracking-tight">Access Denied</h1>
          </div>
        </div>

        <p className="mt-4 text-[14px] leading-relaxed text-muted">
          Your account is authenticated, but is not registered as a PayXa platform administrator. Access to the Central API Diagnostics Control Center is restricted.
        </p>

        {email && (
          <div className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-[12.5px] text-paper flex items-center justify-between">
            <span className="text-dim">Current Identity:</span>
            <span className="font-mono text-neon font-medium">{email}</span>
          </div>
        )}

        <div className="mt-6 space-y-2.5">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-paper p-3 text-[13px] font-medium transition-colors"
          >
            <LayoutDashboard size={15} /> Open Merchant Dashboard
          </Link>

          <form action={signOutAction} className="w-full">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full rounded-xl border border-white/10 hover:border-white/20 text-muted hover:text-paper p-3 text-[13px] font-medium transition-colors"
            >
              <LogOut size={15} /> Sign In With Another Account
            </button>
          </form>
        </div>

        <div className="mt-8 border-t border-white/[0.08] pt-4 text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[12px] text-dim hover:text-paper transition-colors">
            <ArrowLeft size={13} /> Back to PayXa Home
          </Link>
        </div>
      </div>
    </div>
  );
}

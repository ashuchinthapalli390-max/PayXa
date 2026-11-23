"use client";

import { useState } from "react";
import { ShieldCheck, Check, Loader2, ArrowLeft } from "lucide-react";
import TurnstileWidget from "@/components/auth/TurnstileWidget";
import Link from "next/link";

interface SSOVerifyGateProps {
  siteKey: string;
  email: string;
  dest: string;
}

export default function SSOVerifyGate({ siteKey, email, dest }: SSOVerifyGateProps) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTurnstileSuccess = async (token: string) => {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/sso/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, dest })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Security verification failed.");
      }

      setSuccess(true);
      window.setTimeout(() => {
        window.location.replace(data.redirect || `/api/sso/dash/authorize?dest=${encodeURIComponent(dest)}`);
      }, 500);
    } catch (err) {
      setError((err instanceof Error && err.message) || "Failed to verify Turnstile challenge.");
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-[100svh] items-center justify-center px-4 py-16 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_40%,rgba(100,10,30,0.25),transparent_65%)]" />

      <div className="w-full max-w-[460px] rounded-3xl border border-white/10 bg-[#0f0e12]/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-crimson/15 text-neon">
            <ShieldCheck size={26} />
          </span>
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-dim uppercase">Central API Administration</div>
            <h1 className="text-[20px] font-semibold text-paper tracking-tight">Security Verification</h1>
          </div>
        </div>

        <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
          Cloudflare is verifying this browser before issuing a privileged SSO authorization ticket to access the PayXa API Control Center.
        </p>

        <div className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-[12.5px] text-paper flex items-center justify-between">
          <span className="text-dim">Authenticated as:</span>
          <span className="font-mono text-neon font-medium">{email}</span>
        </div>

        <div className="mt-6">
          <TurnstileWidget
            siteKey={siteKey}
            action="admin-sso"
            onSuccess={handleTurnstileSuccess}
            onError={(msg) => setError(msg || "Verification failed")}
          />
        </div>

        {submitting && !success && (
          <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[13px] text-muted">
            <Loader2 size={16} className="animate-spin text-neon" />
            <span>Establishing secure administrator SSO session...</span>
          </div>
        )}

        {success && (
          <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-[13px] text-emerald-400">
            <Check size={16} />
            <span>Verified. Redirecting to API Control Center...</span>
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-xl border border-crimson/40 bg-crimson/10 p-3 text-[12.5px] text-paper text-center">
            {error}
          </div>
        )}

        <div className="mt-8 border-t border-white/[0.08] pt-4 flex items-center justify-between text-[12px] text-dim">
          <Link href="/login" className="flex items-center gap-1.5 hover:text-paper transition-colors">
            <ArrowLeft size={13} /> Switch Account
          </Link>
          <span>Cloudflare Turnstile Protected</span>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { AlertTriangle, Info, Mail } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";
import AuthVisual from "@/components/auth/AuthVisual";
import { GoogleSubmit, TestSubmit } from "@/components/auth/GoogleButton";
import TurnstileWidget from "@/components/auth/TurnstileWidget";
import { signInAsTestMerchant, signInWithGoogle } from "@/app/(auth)/actions";

const errorText: Record<string, string> = {
  OAuthSignin: "We couldn't start Google sign-in. Please try again.",
  OAuthCallback: "Google sign-in was interrupted. Please try again.",
  OAuthAccountNotLinked: "This email is linked to a different sign-in method.",
  AccessDenied: "Access was denied. Use an account that's allowed for this workspace.",
  Configuration: "Sign-in isn't configured yet on this server.",
};

export default function AuthShell({
  mode,
  googleEnabled,
  testLoginEnabled,
  callbackUrl,
  error,
  siteKey,
}: {
  mode: "login" | "register";
  googleEnabled: boolean;
  testLoginEnabled: boolean;
  callbackUrl: string;
  error?: string;
  siteKey?: string;
}) {
  const login = mode === "login";
  return (
    <section className="relative min-h-[100svh] overflow-hidden" data-scene="card" data-side="right">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_50%,rgba(100,10,30,0.23),transparent_55%)]" />
      <div className="container-px grid min-h-[100svh] grid-cols-1 items-center gap-16 pt-[calc(var(--nav-h)+24px)] pb-16 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-24">
        <Reveal>
          <div className="w-full">
            <div className="eyebrow flex items-center gap-3">
              <span className="pulse-dot" />
              {login ? "Merchant workspace" : "Create your workspace"}
            </div>
            <h1 className="display mt-5 text-[clamp(38px,5vw,60px)]">
              {login ? (
                <>
                  Welcome <span className="text-gradient-red">back.</span>
                </>
              ) : (
                <>
                  Start with <span className="text-gradient-red">PayXa.</span>
                </>
              )}
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              {login
                ? "Sign in to see live checkouts, verified payments and your paired devices."
                : "Free sandbox and a ₹0 PayXa platform fee on the proposed Starter plan. Set up takes minutes."}
            </p>

            {error && (
              <div role="alert" className="mt-6 flex items-start gap-3 rounded-2xl border border-crimson/40 bg-crimson/10 p-4 text-[13px] text-paper">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-neon" />
                {errorText[error] ?? "Sign-in failed. Please try again."}
              </div>
            )}

            {siteKey && (
              <div className="mt-6">
                <TurnstileWidget
                  siteKey={siteKey}
                  action={login ? "merchant-login" : "merchant-register"}
                  onSuccess={() => {}}
                />
              </div>
            )}

            <form action={signInWithGoogle} className="mt-8">
              <input type="hidden" name="callbackUrl" value={callbackUrl} />
              <GoogleSubmit label={login ? "Continue with Google" : "Sign up with Google"} disabled={!googleEnabled} />
            </form>
            {!googleEnabled && (
              <p className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed text-dim">
                <Info size={13} className="mt-0.5 shrink-0" />
                Google sign-in turns on once AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET are set on the server.
              </p>
            )}

            <div className="my-7 flex items-center gap-4 font-mono text-[10px] tracking-[0.2em] text-dim uppercase">
              <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-surface/60 p-4">
              <label className="block">
                <span className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">Work email</span>
                <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-ink px-4 py-3 opacity-70">
                  <Mail size={16} className="text-dim" />
                  <input disabled placeholder="you@business.in" className="w-full bg-transparent text-[15px] outline-none placeholder:text-dim" />
                </div>
              </label>
              <p className="mt-3 text-[12px] text-dim">Email and password sign-in opens with merchant onboarding. Use Google for now.</p>
            </div>

            {testLoginEnabled && (
              <form action={signInAsTestMerchant} className="mt-4">
                <input type="hidden" name="callbackUrl" value={callbackUrl} />
                <TestSubmit />
                <p className="mt-2 text-center font-mono text-[10px] tracking-[0.14em] text-dim uppercase">Development builds only</p>
              </form>
            )}

            <p className="mt-8 text-[13px] text-muted">
              {login ? "New to PayXa? " : "Already have a workspace? "}
              <Link href={login ? "/register" : "/login"} className="font-semibold text-neon hover:underline">
                {login ? "Create an account" : "Log in"}
              </Link>
            </p>
            <p className="mt-3 text-[12px] leading-relaxed text-dim">
              By continuing you agree to the{" "}
              <Link href="/legal/terms" className="underline hover:text-muted">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/legal/privacy" className="underline hover:text-muted">
                Privacy policy
              </Link>
              .
            </p>
          </div>
        </Reveal>

        <div className="hidden lg:block">
          <AuthVisual />
          <div className="mx-auto mt-20 grid max-w-[460px] grid-cols-3 gap-4 text-center">
            {[
              ["₹0", "Platform fee"],
              ["2 min", "Device pairing"],
              ["24/7", "Live alerts"],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="font-display text-xl font-semibold">{v}</div>
                <div className="mt-1 font-mono text-[10px] tracking-[0.16em] text-dim uppercase">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

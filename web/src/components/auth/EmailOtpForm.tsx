"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, ArrowRight, CheckCircle2, Loader2, Mail, RotateCcw, User } from "lucide-react";
import TurnstileWidget from "./TurnstileWidget";
import { emailAuth, type EmailAuthState } from "@/app/(auth)/email-actions";

const ease = [0.16, 1, 0.3, 1] as const;
const field =
  "w-full rounded-xl border border-white/10 bg-ink px-4 py-3 pl-11 text-[15px] text-paper outline-none transition-[border-color,box-shadow] placeholder:text-dim focus:border-neon focus:shadow-[0_0_0_3px_rgba(255,66,101,0.15)]";

function Submit({ children, disabled, intent }: { children: React.ReactNode; disabled?: boolean; intent: "send" | "verify" }) {
  const { pending, data } = useFormStatus();
  const mine = pending && data?.get("intent") === intent;
  return (
    <button
      type="submit"
      name="intent"
      value={intent}
      disabled={disabled || pending}
      className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-crimson py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#c40425] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {mine ? <Loader2 size={17} className="animate-spin" /> : null}
      {children}
    </button>
  );
}

function ResendButton({ wait }: { wait: number }) {
  const { pending, data } = useFormStatus();
  const sending = pending && data?.get("intent") === "send";
  return (
    <button type="submit" name="intent" value="send" disabled={wait > 0 || pending} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-neon disabled:text-dim">
      {sending ? <Loader2 size={13} className="animate-spin" /> : <RotateCcw size={13} />}
      {wait > 0 ? `Resend code in ${wait}s` : "Resend code"}
    </button>
  );
}

/** Passwordless email sign-up / sign-in with a 6-digit code (sent by Resend). */
export default function EmailOtpForm({ mode, callbackUrl, siteKey }: { mode: "login" | "register"; callbackUrl: string; siteKey?: string }) {
  const [state, action] = useActionState<EmailAuthState, FormData>(emailAuth, { step: "email", email: "", name: "" });
  const [editing, setEditing] = useState(false);
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [wait, setWait] = useState(0);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  const verifyBtn = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const step = editing ? "email" : state.step;

  // React to each server response: countdown, clear wrong code, focus first box.
  useEffect(() => {
    setEditing(false);
    // A wrong-code response carries no `wait`, so the running resend countdown keeps going.
    if (state.wait !== undefined) setWait(state.wait);
    if (state.step === "code") {
      setDigits(Array(6).fill(""));
      window.setTimeout(() => boxes.current[0]?.focus(), 60);
    }
  }, [state]);

  useEffect(() => {
    if (wait <= 0) return;
    const t = window.setTimeout(() => setWait((w) => w - 1), 1000);
    return () => window.clearTimeout(t);
  }, [wait]);

  const setAt = (i: number, v: string) => {
    const clean = v.replace(/\D/g, "");
    if (clean.length > 1) {
      // paste of the whole code
      const next = clean.slice(0, 6).split("");
      const filled = [...next, ...Array(6 - next.length).fill("")];
      setDigits(filled);
      boxes.current[Math.min(next.length, 5)]?.focus();
      if (next.length === 6) window.setTimeout(() => formRef.current?.requestSubmit(verifyBtn.current ?? undefined), 0);
      return;
    }
    const next = [...digits];
    next[i] = clean;
    setDigits(next);
    if (clean && i < 5) boxes.current[i + 1]?.focus();
    if (next.every(Boolean)) window.setTimeout(() => formRef.current?.requestSubmit(verifyBtn.current ?? undefined), 0);
  };

  return (
    <form ref={formRef} action={action} className="space-y-4" noValidate>
      <input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <AnimatePresence mode="wait" initial={false}>
        {step === "email" ? (
          <motion.div key="email" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease }} className="space-y-3">
            {mode === "register" && (
              <label className="relative block">
                <span className="sr-only">Full name</span>
                <User size={16} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-dim" />
                <input name="name" defaultValue={state.name} autoComplete="name" placeholder="Full name" required minLength={2} maxLength={80} className={field} />
              </label>
            )}
            <label className="relative block">
              <span className="sr-only">Email address</span>
              <Mail size={16} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-dim" />
              <input name="email" type="email" defaultValue={state.email} autoComplete="email" inputMode="email" placeholder="you@business.in" required className={field} />
            </label>
            {siteKey && <TurnstileWidget key={`e${state.captcha ?? 0}`} siteKey={siteKey} action={mode === "register" ? "merchant-register" : "merchant-login"} />}
            <Submit intent="send">
              {mode === "register" ? "Create account" : "Email me a sign-in code"} <ArrowRight size={16} />
            </Submit>
          </motion.div>
        ) : (
          <motion.div key="code" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease }} className="space-y-4">
            <input type="hidden" name="email" value={state.email} />
            <input type="hidden" name="name" value={state.name} />
            <input type="hidden" name="code" value={digits.join("")} />
            <div className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-surface/60 p-4 text-[13px] text-muted">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-ok" />
              <div>
                Enter the 6-digit code sent to <span className="font-semibold text-paper">{state.email}</span>.{" "}
                <button type="button" onClick={() => setEditing(true)} className="font-semibold text-neon hover:underline">
                  Change
                </button>
              </div>
            </div>
            <fieldset>
              <legend className="sr-only">Verification code</legend>
              <div className="grid grid-cols-6 gap-2">
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      boxes.current[i] = el;
                    }}
                    value={d}
                    onChange={(e) => setAt(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !digits[i] && i > 0) boxes.current[i - 1]?.focus();
                      if (e.key === "ArrowLeft" && i > 0) boxes.current[i - 1]?.focus();
                      if (e.key === "ArrowRight" && i < 5) boxes.current[i + 1]?.focus();
                    }}
                    onFocus={(e) => e.target.select()}
                    inputMode="numeric"
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    aria-label={`Digit ${i + 1}`}
                    maxLength={6}
                    className="h-14 w-full rounded-xl border border-white/10 bg-ink text-center font-mono text-[22px] font-semibold text-paper outline-none transition-[border-color,box-shadow] focus:border-neon focus:shadow-[0_0_0_3px_rgba(255,66,101,0.15)]"
                  />
                ))}
              </div>
            </fieldset>
            <button
              ref={verifyBtn}
              type="submit"
              name="intent"
              value="verify"
              className="sr-only"
              tabIndex={-1}
              aria-hidden
            />
            <Submit intent="verify" disabled={digits.join("").length !== 6}>
              Verify and continue <ArrowRight size={16} />
            </Submit>
            {siteKey && wait === 0 && <TurnstileWidget key={`c${state.captcha ?? 0}`} siteKey={siteKey} action={mode === "register" ? "merchant-register" : "merchant-login"} />}
            <div className="flex items-center justify-between text-[12px] text-dim">
              <span>Code expires in 10 minutes.</span>
              <ResendButton wait={wait} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(state.error || (state.info && step === "code" && !state.error)) && (
        <div
          role={state.error ? "alert" : "status"}
          className={`flex items-start gap-2.5 rounded-xl border p-3 text-[13px] ${state.error ? "border-crimson/40 bg-crimson/10 text-paper" : "border-white/[0.07] bg-white/[0.02] text-muted"}`}
        >
          {state.error ? <AlertTriangle size={15} className="mt-0.5 shrink-0 text-neon" /> : null}
          {state.error ?? state.info}
        </div>
      )}
    </form>
  );
}

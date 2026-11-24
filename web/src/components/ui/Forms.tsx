"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, CheckCircle2, Loader2, Send } from "lucide-react";
import TurnstileWidget from "@/components/auth/TurnstileWidget";
import Select from "@/components/ui/Select";
import { sendContact, type ContactState } from "@/app/(site)/contact/actions";

const inputCls =
  "mt-2 w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-[15px] text-paper placeholder:text-dim outline-none transition-[border-color,box-shadow] focus:border-neon focus:shadow-[0_0_0_3px_rgba(255,66,101,0.09)]";

export function Field({
  label,
  name,
  type = "text",
  placeholder,
  textarea,
  autoComplete,
  required,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
  autoComplete?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">{label}</span>
      {textarea ? (
        <textarea name={name} placeholder={placeholder} rows={5} required={required} maxLength={maxLength} className={`${inputCls} resize-none`} />
      ) : (
        <input name={name} type={type} placeholder={placeholder} autoComplete={autoComplete} required={required} maxLength={maxLength} className={inputCls} />
      )}
    </label>
  );
}

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
      {pending ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}

/** Contact form: delivered to the PayXa inbox by email (Resend), with a copy receipt to the sender. */
export function ContactForm({ siteKey }: { siteKey?: string }) {
  const [state, action] = useActionState<ContactState, FormData>(sendContact, { status: "idle" });

  if (state.status === "sent")
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center py-10 text-center" role="status">
        <span className="grid size-14 place-items-center rounded-full bg-ok/10 text-ok">
          <CheckCircle2 size={26} />
        </span>
        <h3 className="mt-5 font-display text-xl font-semibold">Message sent</h3>
        <p className="mt-2 max-w-sm text-[14px] text-muted">Thanks for reaching out. We&apos;ve emailed you a confirmation and the right person will reply, usually within one business day.</p>
      </motion.div>
    );

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" autoComplete="name" required maxLength={80} />
        <Field label="Work email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company / website" name="company" maxLength={120} />
        <div>
          <span className="block font-mono text-[11px] tracking-[0.14em] text-muted uppercase">Topic</span>
          <Select
            name="topic"
            defaultValue="Sales & partnerships"
            aria-label="Topic"
            className="mt-2 !h-[50px] !px-4 !text-[15px]"
            options={[
              { value: "Sales & partnerships", label: "Sales & partnerships", hint: "Merchants, banks and PSPs" },
              { value: "Support", label: "Support", hint: "Account and integration help" },
              { value: "Security", label: "Security", hint: "Responsible disclosure" },
              { value: "Other", label: "Other" },
            ]}
          />
        </div>
      </div>
      <Field label="How can we help?" name="message" textarea required maxLength={5000} />
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      {siteKey && <TurnstileWidget key={state.captcha ?? 0} siteKey={siteKey} action="contact" />}
      <SendButton />
      <AnimatePresence>
        {state.status === "error" && state.message && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-crimson/40 bg-crimson/10 p-4 text-[13px] text-paper"
          >
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-neon" />
            {state.message}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

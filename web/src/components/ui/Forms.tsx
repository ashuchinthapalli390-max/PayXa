"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Info } from "lucide-react";

export function Field({
  label,
  name,
  type = "text",
  placeholder,
  textarea,
  autoComplete,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
  autoComplete?: string;
  required?: boolean;
}) {
  const cls =
    "mt-2 w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-[15px] text-paper placeholder:text-dim outline-none transition-[border-color,box-shadow] focus:border-neon focus:shadow-[0_0_0_3px_rgba(255,66,101,0.09)]";
  return (
    <label className="block">
      <span className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">{label}</span>
      {textarea ? (
        <textarea name={name} placeholder={placeholder} rows={5} required={required} className={`${cls} resize-none`} />
      ) : (
        <input name={name} type={type} placeholder={placeholder} autoComplete={autoComplete} required={required} className={cls} />
      )}
    </label>
  );
}

/** Pre-launch form: validates locally, sends nothing, and says so. */
export function PreviewForm({
  children,
  submitLabel,
  notice,
  className = "",
}: {
  children: ReactNode;
  submitLabel: string;
  notice: string;
  className?: string;
}) {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <form onSubmit={onSubmit} className={`space-y-5 ${className}`} noValidate={false}>
      {children}
      <button type="submit" className="btn btn-primary w-full">
        {submitLabel}
      </button>
      <AnimatePresence>
        {sent && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 rounded-xl border border-warn/30 bg-warn/[0.07] p-4 text-[13px] text-muted"
            role="status"
          >
            <Info size={16} className="mt-0.5 shrink-0 text-warn" />
            {notice}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

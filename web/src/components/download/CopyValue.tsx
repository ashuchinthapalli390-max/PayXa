"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** A checksum / fingerprint with a one-click copy button. */
export default function CopyValue({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <div className="eyebrow">{label}</div>
      <div className="mt-2 flex items-start gap-2">
        <code className="min-w-0 flex-1 break-all rounded-lg border border-white/[0.08] bg-black/40 px-3 py-2 font-mono text-[11.5px] leading-relaxed text-paper/90">{value}</code>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 text-muted transition hover:border-white/25 hover:text-paper active:scale-95"
          aria-label={`Copy ${label}`}
        >
          {copied ? <Check size={14} className="text-neon" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}

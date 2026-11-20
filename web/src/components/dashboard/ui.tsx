import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Clock, Loader2, Radar, XCircle, type LucideIcon } from "lucide-react";
import { statusMeta, type PayStatus } from "@/lib/dashboard-data";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1.5 text-[14px] text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, action, children, className = "", pad = true }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; pad?: boolean }) {
  return (
    <section className={`rounded-2xl border border-white/[0.06] bg-[#0f0e12] ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.05] px-5 py-3.5">
          <h2 className="text-[14px] font-semibold">{title}</h2>
          {action}
        </div>
      )}
      <div className={pad ? "p-5" : ""}>{children}</div>
    </section>
  );
}

const toneIcon: Record<string, LucideIcon> = { ok: CheckCircle2, warn: Radar, bad: AlertTriangle, info: Loader2, muted: Clock };
const toneCls: Record<string, string> = {
  ok: "border-ok/30 bg-ok/10 text-ok",
  warn: "border-warn/30 bg-warn/10 text-warn",
  bad: "border-crimson/40 bg-crimson/10 text-neon",
  info: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  muted: "border-white/10 bg-white/[0.04] text-muted",
};

/** Status always carries icon + label, never colour alone. */
export function StatusBadge({ status }: { status: PayStatus }) {
  const m = statusMeta[status];
  const Icon = status === "expired" ? XCircle : toneIcon[m.tone];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-medium whitespace-nowrap ${toneCls[m.tone]}`}>
      <Icon size={12} className={status === "started" ? "animate-spin [animation-duration:2.5s]" : ""} />
      {m.label}
    </span>
  );
}

export function Pill({ children, tone = "muted" }: { children: ReactNode; tone?: keyof typeof toneCls }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-medium ${toneCls[tone]}`}>{children}</span>;
}

export function Kpi({ label, value, delta, hint, icon: Icon }: { label: string; value: string; delta?: string; hint?: string; icon: LucideIcon }) {
  const up = delta?.startsWith("+");
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0f0e12] p-5 transition-colors hover:border-crimson/30">
      <div className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-crimson/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-muted">{label}</span>
        <span className="grid size-8 place-items-center rounded-lg bg-white/[0.04] text-dim">
          <Icon size={16} />
        </span>
      </div>
      <div className="mt-3 font-display text-[28px] font-semibold tracking-tight tabular-nums">{value}</div>
      <div className="mt-1 flex items-center gap-2 text-[12px]">
        {delta && <span className={up ? "text-ok" : "text-neon"}>{delta}</span>}
        {hint && <span className="text-dim">{hint}</span>}
      </div>
    </div>
  );
}

export function Btn({ children, variant = "ghost", className = "", ...rest }: { children: ReactNode; variant?: "primary" | "ghost" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex h-9 items-center gap-2 rounded-xl px-3.5 text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        variant === "primary" ? "bg-crimson text-white hover:bg-[#e8062f] shadow-[0_6px_20px_-8px_rgba(217,4,41,0.8)]" : "border border-white/10 text-paper hover:border-white/20 hover:bg-white/[0.03]"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function Empty({ icon: Icon, title, body, action }: { icon: LucideIcon; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-crimson/10 text-neon">
        <Icon size={22} />
      </span>
      <div className="mt-4 text-[15px] font-semibold">{title}</div>
      <p className="mt-1 max-w-sm text-[13px] text-muted">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export const th = "px-4 py-3 text-left font-mono text-[10px] font-medium tracking-[0.16em] text-dim uppercase whitespace-nowrap";
export const td = "px-4 py-3.5 text-[13px] whitespace-nowrap";

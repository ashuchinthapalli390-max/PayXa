import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Copy, RotateCcw } from "lucide-react";
import { Panel, StatusBadge } from "@/components/dashboard/ui";
import { formatINR, payments, timeLabel, timelineFor, webhookDeliveries } from "@/lib/dashboard-data";

export const metadata: Metadata = { title: "Payment" };

const dot: Record<string, string> = { info: "bg-sky-300", warn: "bg-warn", ok: "bg-ok", bad: "bg-neon", muted: "bg-dim" };

export default async function PaymentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = payments.find((x) => x.id === id);
  if (!p) notFound();
  const steps = timelineFor(p);
  const deliveries = webhookDeliveries.filter((w) => w.order === p.order);

  const fields: [string, string][] = [
    ["Payment ID", p.id],
    ["Order", p.order],
    ["Amount", `${formatINR(p.amount)} (${p.amount} paise)`],
    ["Method", p.method],
    ["Receiving UPI", "codexa@payxatest"],
    ["Customer", `${p.customer} · ${p.customerRef}`],
    ["Detected by", p.status === "started" || p.status === "expired" ? "—" : p.device],
    ["UTR", p.status === "started" || p.status === "expired" ? "—" : `••••••${p.utrTail.slice(-4)}`],
    ["Verification source", p.status === "verified" ? "BANK_PSP" : "Pending"],
    ["Created", timeLabel(p.createdAt)],
  ];

  return (
    <div className="mx-auto max-w-[1200px]">
      <Link href="/dashboard/payments" className="mb-5 inline-flex items-center gap-2 text-[13px] text-muted hover:text-paper">
        <ArrowLeft size={14} /> Payments
      </Link>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="font-mono text-[12px] text-dim">{p.order}</div>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-semibold tracking-tight tabular-nums">{formatINR(p.amount)}</h1>
            <StatusBadge status={p.status} />
          </div>
          <p className="mt-1.5 text-[14px] text-muted">
            {p.customer} · {p.method} · {timeLabel(p.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 px-3.5 text-[13px] disabled:cursor-not-allowed disabled:opacity-50" disabled title="Refund recording arrives with live mode">

            <RotateCcw size={14} /> Record refund
          </button>
        </div>
      </div>

      {(p.status === "review" || p.status === "late") && (
        <div className="mb-6 rounded-2xl border border-crimson/40 bg-crimson/10 p-4 text-[13px]">
          <span className="font-semibold text-neon">Action needed. </span>
          {p.status === "review"
            ? "Another open order has the same amount, so PayXa won't guess which one this credit belongs to. Pick the right order to resolve."
            : "This credit arrived after the checkout expired. Decide whether to fulfil or refund it from your account."}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr] [&>*]:min-w-0">
        <Panel title="Event timeline">
          <ol className="relative">
            {steps.map((s, i) => (
              <li key={s.label} className="relative flex gap-4 pb-6 last:pb-0">
                {i < steps.length - 1 && <span className="absolute top-4 left-[5px] h-full w-px bg-white/10" />}
                <span className={`relative mt-1.5 size-[11px] shrink-0 rounded-full ring-4 ring-[#0f0e12] ${dot[s.tone]}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-[14px] font-medium">{s.label}</span>
                    <span className="font-mono text-[11px] text-dim">{timeLabel(s.at)}</span>
                  </div>
                  <div className="mt-0.5 text-[13px] text-muted">{s.detail}</div>
                </div>
              </li>
            ))}
          </ol>
        </Panel>
        <div className="space-y-6">
          <Panel title="Details">
            <dl className="space-y-3">
              {fields.map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-4 text-[13px]">
                  <dt className="text-dim">{k}</dt>
                  <dd className="text-right font-mono text-[12px] break-all text-paper">{v}</dd>
                </div>
              ))}
            </dl>
          </Panel>
          <Panel title="Webhook deliveries">
            {deliveries.length ? (
              <ul className="space-y-2">
                {deliveries.map((w) => (
                  <li key={w.id} className="flex items-center justify-between font-mono text-[12px]">
                    <span>{w.event}</span>
                    <span className={w.code === 200 ? "text-ok" : "text-neon"}>
                      {w.code} · {w.ms}ms
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-muted">
                {p.status === "verified" ? "payment.verified → 200 (signed)" : "No deliveries yet for this order."}
              </p>
            )}
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-2 font-mono text-[11px] text-dim">
              <Copy size={12} /> GET /v1/payments/{p.id}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

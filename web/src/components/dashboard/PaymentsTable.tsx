"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Download, Search, SearchX } from "lucide-react";
import { Empty, StatusBadge, td, th } from "./ui";
import { formatINR, payments, timeLabel, type PayStatus } from "@/lib/dashboard-data";

const tabs: { id: string; label: string; match: (s: PayStatus) => boolean }[] = [
  { id: "all", label: "All", match: () => true },
  { id: "verified", label: "Verified", match: (s) => s === "verified" },
  { id: "progress", label: "In progress", match: (s) => s === "started" || s === "detected" || s === "verifying" },
  { id: "review", label: "Needs review", match: (s) => s === "review" || s === "late" },
  { id: "expired", label: "Expired", match: (s) => s === "expired" },
];

export default function PaymentsTable({ compactTitle }: { compactTitle?: string }) {
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [method, setMethod] = useState("any");

  const rows = useMemo(() => {
    const t = tabs.find((x) => x.id === tab)!;
    const s = q.trim().toLowerCase();
    return payments.filter(
      (p) =>
        t.match(p.status) &&
        (method === "any" || p.method === method) &&
        (!s || [p.order, p.customer, p.id, p.utrTail].some((v) => v.toLowerCase().includes(s))),
    );
  }, [tab, q, method]);

  const exportCsv = () => {
    const head = ["order", "payment_id", "customer", "method", "status", "amount_inr", "created_at"];
    const lines = rows.map((p) => [p.order, p.id, p.customer, p.method, p.status, (p.amount / 100).toFixed(2), p.createdAt].join(","));
    const blob = new Blob([[head.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "payxa-test-payments.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const counts = Object.fromEntries(tabs.map((t) => [t.id, payments.filter((p) => t.match(p.status)).length]));

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0f0e12]">
      <div className="flex flex-col gap-3 border-b border-white/[0.05] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" className="flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] transition-colors ${
                tab === t.id ? "bg-white/[0.07] text-paper" : "text-muted hover:text-paper"
              }`}
            >
              {compactTitle && t.id === "all" ? compactTitle : t.label}
              <span className="rounded-md bg-white/[0.05] px-1.5 font-mono text-[10px] text-dim">{counts[t.id]}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex h-9 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 text-muted focus-within:border-neon/60">
            <Search size={14} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Order, customer, UTR" className="w-40 bg-transparent text-[13px] text-paper outline-none placeholder:text-dim" aria-label="Filter payments" />
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="h-9 rounded-xl border border-white/[0.08] bg-[#0f0e12] px-3 text-[13px] text-paper outline-none focus:border-neon/60"
            aria-label="Payment method"
          >
            <option value="any">All methods</option>
            <option>QR</option>
            <option>UPI app</option>
            <option>Payment link</option>
          </select>
          <button onClick={exportCsv} className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 px-3 text-[13px] hover:border-white/20">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>
      {rows.length === 0 ? (
        <div className="p-6">
          <Empty icon={SearchX} title="No payments match" body="Try a different status, method or search term." />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/[0.05]">
              <tr>
                <th className={th}>Order</th>
                <th className={th}>Customer</th>
                <th className={th}>Method</th>
                <th className={th}>Status</th>
                <th className={`${th} text-right`}>Amount</th>
                <th className={th}>Device</th>
                <th className={`${th} text-right`}>Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {rows.map((p) => (
                <tr key={p.id} className="group relative transition-colors hover:bg-white/[0.025]">
                  <td className={td}>
                    <Link href={`/dashboard/payments/${p.id}`} className="font-mono text-[12px] text-paper after:absolute after:inset-0 group-hover:text-neon">
                      {p.order}
                    </Link>
                  </td>
                  <td className={td}>
                    <div>{p.customer}</div>
                    <div className="font-mono text-[11px] text-dim">{p.customerRef}</div>
                  </td>
                  <td className={`${td} text-muted`}>{p.method}</td>
                  <td className={td}>
                    <StatusBadge status={p.status} />
                  </td>
                  <td className={`${td} text-right font-semibold tabular-nums`}>{formatINR(p.amount)}</td>
                  <td className={`${td} text-muted`}>{p.device}</td>
                  <td className={`${td} text-right font-mono text-[12px] text-dim`}>{timeLabel(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="border-t border-white/[0.05] px-4 py-3 text-[12px] text-dim">
        Showing {rows.length} of {payments.length} test payments
      </div>
    </div>
  );
}

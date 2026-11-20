import Link from "next/link";
import { ArrowUpRight, Check, CircleDashed, Clock, IndianRupee, Lock, ShieldAlert, Smartphone, Wallet } from "lucide-react";
import { getSession } from "@/auth";
import { Kpi, Panel, PageHeader, StatusBadge, td, th } from "@/components/dashboard/ui";
import { AreaChart, StatusMix } from "@/components/dashboard/Charts";
import { LiveFeed, QuickActions } from "@/components/dashboard/Live";
import { ago, deviceList, formatINR, kpis, payments, volumeSeries } from "@/lib/dashboard-data";

const onboarding = [
  { t: "Create account", done: true },
  { t: "Business details", done: true },
  { t: "Receiving UPI", done: true },
  { t: "Pair a device", done: true },
  { t: "Integrate checkout", done: false, current: true },
  { t: "Go live", done: false, locked: true },
];

export default async function Overview() {
  const session = await getSession();
  const first = session?.user?.name?.split(" ")[0] ?? "there";
  const doneCount = onboarding.filter((s) => s.done).length;
  const hour = Number(new Date().toLocaleString("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }));
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const mix = [
    { label: "Verified", value: payments.filter((p) => p.status === "verified").length, color: "#2bd67b" },
    { label: "In progress", value: payments.filter((p) => ["started", "detected", "verifying"].includes(p.status)).length, color: "#f5a524" },
    { label: "Needs review", value: payments.filter((p) => p.status === "review" || p.status === "late").length, color: "#ff4265" },
    { label: "Expired", value: payments.filter((p) => p.status === "expired").length, color: "#4a4850" },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title={`${greeting}, ${first}`}
        subtitle="Here's what's moving through Aurora Store today."
        actions={
          <Link href="/dashboard/payments" className="inline-flex h-9 items-center gap-2 rounded-xl bg-crimson px-3.5 text-[13px] font-medium text-white shadow-[0_6px_20px_-8px_rgba(217,4,41,0.8)] hover:bg-[#e8062f]">
            View payments <ArrowUpRight size={14} />
          </Link>
        }
      />

      {/* Onboarding */}
      <div className="mb-6 rounded-2xl border border-crimson/25 bg-gradient-to-r from-crimson/[0.12] via-[#0f0e12] to-[#0f0e12] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[14px] font-semibold">Finish setting up · {doneCount} of {onboarding.length}</div>
            <p className="mt-1 text-[13px] text-muted">Add the checkout script to your site, then request live access.</p>
          </div>
          <Link href="/dashboard/developers" className="inline-flex h-9 w-fit items-center gap-2 rounded-xl border border-white/15 px-3.5 text-[13px] hover:border-white/30">
            Continue setup <ArrowUpRight size={14} />
          </Link>
        </div>
        <ol className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {onboarding.map((s, i) => (
            <li
              key={s.t}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-[12px] ${
                s.done ? "border-ok/20 bg-ok/[0.06] text-paper" : s.current ? "border-crimson/40 bg-crimson/10 text-paper" : "border-white/[0.06] text-dim"
              }`}
            >
              {s.done ? <Check size={14} className="text-ok" /> : s.locked ? <Lock size={13} /> : <CircleDashed size={14} className="text-neon" />}
              <span className="font-mono text-[10px] text-dim">0{i + 1}</span> {s.t}
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Verified volume" value={formatINR(kpis.volume, false)} delta="+18.2%" hint="vs last 7 days" icon={IndianRupee} />
        <Kpi label="Verified payments" value={String(kpis.verifiedCount)} delta="+9" hint="this week" icon={Wallet} />
        <Kpi label="Active checkouts" value={String(kpis.active).padStart(2, "0")} hint="right now" icon={Clock} />
        <Kpi label="Needs review" value={String(kpis.review).padStart(2, "0")} hint="same-amount & late" icon={ShieldAlert} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr] [&>*]:min-w-0">
        <Panel
          title="Verified volume · last 14 days"
          action={<span className="font-mono text-[11px] text-dim">INR · verified only</span>}
        >
          <AreaChart data={volumeSeries} />
        </Panel>
        <Panel title="Live activity" action={<span className="flex items-center gap-1.5 font-mono text-[11px] text-ok"><span className="pulse-dot !size-1.5 !bg-ok" /> Live</span>} pad={false}>
          <LiveFeed />
        </Panel>
      </div>

      <div className="mt-6">
        <QuickActions />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr] [&>*]:min-w-0">
        <Panel title="Recent payments" action={<Link href="/dashboard/payments" className="text-[12px] text-neon hover:underline">View all</Link>} pad={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/[0.05]">
                <tr>
                  <th className={th}>Order</th>
                  <th className={th}>Customer</th>
                  <th className={th}>Status</th>
                  <th className={`${th} text-right`}>Amount</th>
                  <th className={`${th} text-right`}>When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {payments.slice(0, 7).map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className={td}>
                      <Link href={`/dashboard/payments/${p.id}`} className="font-mono text-[12px] text-paper hover:text-neon">
                        {p.order}
                      </Link>
                    </td>
                    <td className={`${td} text-muted`}>{p.customer}</td>
                    <td className={td}>
                      <StatusBadge status={p.status} />
                    </td>
                    <td className={`${td} text-right font-semibold tabular-nums`}>{formatINR(p.amount)}</td>
                    <td className={`${td} text-right text-dim`}>{ago(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <div className="space-y-6">
          <Panel title="Payment status · last 64">
            <StatusMix items={mix} />
          </Panel>
          <Panel title="Devices" action={<Link href="/dashboard/devices" className="text-[12px] text-neon hover:underline">Manage</Link>}>
            <ul className="space-y-3">
              {deviceList.map((d) => (
                <li key={d.id} className="flex items-center gap-3">
                  <span className={`grid size-9 place-items-center rounded-xl ${d.status === "online" ? "bg-ok/10 text-ok" : "bg-white/[0.04] text-dim"}`}>
                    <Smartphone size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium">{d.name}</div>
                    <div className="text-[12px] text-dim">
                      {d.status === "online" ? `Synced ${ago(d.lastSync)}` : `Offline · ${d.queue} queued`}
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 text-[12px] ${d.status === "online" ? "text-ok" : "text-dim"}`}>
                    <span className={`size-1.5 rounded-full ${d.status === "online" ? "bg-ok" : "bg-dim"}`} />
                    {d.status === "online" ? "Online" : "Offline"}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

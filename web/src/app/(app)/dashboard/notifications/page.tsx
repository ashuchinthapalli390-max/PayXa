import type { Metadata } from "next";
import { BellRing, Radar, ShieldCheck, TriangleAlert, WifiOff } from "lucide-react";
import { PageHeader, Panel } from "@/components/dashboard/ui";
import { Toggle } from "@/components/dashboard/Interactive";

export const metadata: Metadata = { title: "Notifications" };

const prefs = [
  { icon: BellRing, t: "Payment Started", d: "Push the moment a new checkout session is created", on: true, tone: "text-sky-300" },
  { icon: Radar, t: "Credit detected", d: "When a paired phone reports an incoming credit", on: false, tone: "text-warn" },
  { icon: ShieldCheck, t: "Payment verified", d: "After trusted bank/PSP confirmation", on: true, tone: "text-ok" },
  { icon: TriangleAlert, t: "Needs review", d: "Same-amount conflicts and late payments", on: true, tone: "text-neon" },
  { icon: WifiOff, t: "Device offline", d: "When a paired phone stops syncing for 10 minutes", on: true, tone: "text-muted" },
];

const history = [
  ["18:26", "Payment Started", "PXA-20484 · ₹499.00 · 2 devices"],
  ["18:25", "Payment verified", "PXA-20482 · ₹799.00"],
  ["18:22", "Needs review", "Two open ₹499 orders"],
  ["17:43", "Device offline", "Backup phone · 2 events queued"],
  ["17:40", "Payment verified", "PXA-20476 · ₹2,500.00"],
];

export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader title="Notifications" subtitle="Choose which alerts reach your phones and your inbox." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Panel title="Push alerts">
          <ul className="divide-y divide-white/[0.05]">
            {prefs.map((p) => (
              <li key={p.t} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                <span className={`grid size-9 place-items-center rounded-xl bg-white/[0.04] ${p.tone}`}>
                  <p.icon size={16} />
                </span>
                <div className="flex-1">
                  <div className="text-[14px]">{p.t}</div>
                  <div className="text-[12px] text-dim">{p.d}</div>
                </div>
                <Toggle defaultOn={p.on} label={p.t} />
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Recent dispatches" pad={false}>
          <ul className="divide-y divide-white/[0.04]">
            {history.map(([t, e, d]) => (
              <li key={t + e} className="flex gap-4 px-5 py-3">
                <span className="w-12 font-mono text-[12px] text-dim">{t}</span>
                <div>
                  <div className="text-[13px] font-medium">{e}</div>
                  <div className="text-[12px] text-muted">{d}</div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

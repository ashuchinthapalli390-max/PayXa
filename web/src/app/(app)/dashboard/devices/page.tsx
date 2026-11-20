import type { Metadata } from "next";
import { BatteryLow, BatteryMedium, BellRing, Smartphone, Wifi, WifiOff } from "lucide-react";
import { PageHeader, Pill } from "@/components/dashboard/ui";
import { PairDevice } from "@/components/dashboard/Interactive";
import { ago, deviceList } from "@/lib/dashboard-data";

export const metadata: Metadata = { title: "Devices" };

export default function DevicesPage() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Devices" subtitle="Merchant phones that receive alerts and report incoming credits." actions={<PairDevice />} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {deviceList.map((d) => {
          const online = d.status === "online";
          return (
            <article key={d.id} className={`rounded-2xl border bg-[#0f0e12] p-5 ${online ? "border-white/[0.06]" : "border-crimson/30"}`}>
              <div className="flex items-start justify-between">
                <span className={`grid size-12 place-items-center rounded-2xl ${online ? "bg-ok/10 text-ok" : "bg-crimson/10 text-neon"}`}>
                  <Smartphone size={22} />
                </span>
                <Pill tone={online ? "ok" : "bad"}>
                  {online ? <Wifi size={12} /> : <WifiOff size={12} />} {online ? "Online" : "Offline"}
                </Pill>
              </div>
              <h2 className="mt-4 text-[16px] font-semibold">{d.name}</h2>
              <p className="text-[13px] text-muted">{d.model}</p>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-[13px]">
                <div className="rounded-xl bg-white/[0.03] p-3">
                  <dt className="text-[11px] text-dim">Last sync</dt>
                  <dd className="mt-0.5">{ago(d.lastSync)}</dd>
                </div>
                <div className="rounded-xl bg-white/[0.03] p-3">
                  <dt className="text-[11px] text-dim">Offline queue</dt>
                  <dd className={`mt-0.5 ${d.queue ? "text-warn" : ""}`}>{d.queue} events</dd>
                </div>
                <div className="rounded-xl bg-white/[0.03] p-3">
                  <dt className="text-[11px] text-dim">Notification access</dt>
                  <dd className={`mt-0.5 flex items-center gap-1.5 ${d.notif ? "text-ok" : "text-warn"}`}>
                    <BellRing size={12} /> {d.notif ? "Granted" : "Not granted"}
                  </dd>
                </div>
                <div className="rounded-xl bg-white/[0.03] p-3">
                  <dt className="text-[11px] text-dim">Battery · App</dt>
                  <dd className={`mt-0.5 flex items-center gap-1.5 ${d.battery < 25 ? "text-neon" : ""}`}>
                    {d.battery < 25 ? <BatteryLow size={13} /> : <BatteryMedium size={13} />} {d.battery}% · {d.app}
                  </dd>
                </div>
              </dl>
              {!online && (
                <p className="mt-4 rounded-xl border border-crimson/30 bg-crimson/10 p-3 text-[12px] text-paper">
                  Queued events will sync automatically when this phone reconnects. Check battery optimisation if it keeps dropping.
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

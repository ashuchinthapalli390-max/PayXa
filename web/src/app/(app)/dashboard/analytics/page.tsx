import type { Metadata } from "next";
import { Activity, Gauge, Percent, Timer } from "lucide-react";
import { Kpi, PageHeader, Panel, td, th } from "@/components/dashboard/ui";
import { AreaChart, HourBars } from "@/components/dashboard/Charts";
import { hourly, volumeSeries } from "@/lib/dashboard-data";

export const metadata: Metadata = { title: "Analytics" };

const latency = [
  ["Checkout event stored", "212 ms", "< 500 ms"],
  ["Push job enqueued", "64 ms", "< 200 ms"],
  ["Alert parsed on device", "180 ms", "< 300 ms"],
  ["Backend matching", "240 ms", "< 500 ms"],
  ["Verified update on site", "640 ms", "< 1 s"],
];

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Analytics" subtitle="Volume, conversion and how fast each step of the pipeline runs." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Checkout → verified" value="86.4%" delta="+2.1%" hint="conversion" icon={Percent} />
        <Kpi label="Median time to verify" value="41 s" delta="-6 s" hint="vs last week" icon={Timer} />
        <Kpi label="Auto-matched" value="97.2%" hint="no review needed" icon={Activity} />
        <Kpi label="Push delivered < 5s" value="94%" hint="of dispatched alerts" icon={Gauge} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr] [&>*]:min-w-0">
        <Panel title="Verified volume · last 14 days">
          <AreaChart data={volumeSeries} height={260} />
        </Panel>
        <Panel title="Checkouts by hour · today">
          <HourBars data={hourly} />
          <p className="mt-4 text-[12px] text-dim">Peak at 18:00. Keep the counter phone charged in the evening rush.</p>
        </Panel>
      </div>
      <Panel title="Pipeline latency · P95, test mode" className="mt-6" pad={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/[0.05]">
              <tr>
                <th className={th}>Stage</th>
                <th className={`${th} text-right`}>Measured</th>
                <th className={`${th} text-right`}>Target</th>
                <th className={th}>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {latency.map(([s, m, t]) => (
                <tr key={s}>
                  <td className={td}>{s}</td>
                  <td className={`${td} text-right font-mono`}>{m}</td>
                  <td className={`${td} text-right font-mono text-dim`}>{t}</td>
                  <td className={td}>
                    <span className="inline-flex items-center gap-1.5 text-[12px] text-ok">
                      <span className="size-1.5 rounded-full bg-ok" /> Within target
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

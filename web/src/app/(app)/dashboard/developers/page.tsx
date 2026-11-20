import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Gauge } from "lucide-react";
import { PageHeader, Panel } from "@/components/dashboard/ui";
import { ApiKeys, WebhookTester } from "@/components/dashboard/Interactive";
import { webhookDeliveries } from "@/lib/dashboard-data";

export const metadata: Metadata = { title: "Developers" };

const requests = [
  ["POST", "/v1/orders", 201, "38ms"],
  ["POST", "/v1/checkout-sessions", 201, "44ms"],
  ["GET", "/v1/payments/pay_test_5mz1c", 200, "21ms"],
  ["POST", "/v1/orders", 422, "12ms"],
  ["GET", "/v1/transactions?limit=20", 200, "57ms"],
] as const;

export default function DevelopersPage() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="Developers"
        subtitle="API keys, webhooks and request logs. Test and live are fully separated."
        actions={
          <Link href="/docs" className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 px-3.5 text-[13px] hover:border-white/20">
            API docs <ArrowUpRight size={14} />
          </Link>
        }
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 [&>*]:min-w-0">
        <Panel title="API keys">
          <ApiKeys />
        </Panel>
        <Panel title="Usage · today" action={<Gauge size={16} className="text-dim" />}>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["1,284", "Requests"],
              ["0.4%", "Error rate"],
              ["41ms", "P95 latency"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-xl bg-white/[0.03] p-4">
                <div className="font-display text-xl font-semibold">{v}</div>
                <div className="mt-1 text-[12px] text-dim">{l}</div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[12px] text-muted">
              <span>Rate limit</span>
              <span className="font-mono">1,284 / 10,000 per hour</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full w-[13%] rounded-full bg-crimson" />
            </div>
          </div>
        </Panel>
        <Panel title="Webhooks · test endpoint" className="xl:col-span-2">
          <WebhookTester initial={webhookDeliveries} />
          <p className="mt-3 text-[12px] text-dim">Signed with HMAC-SHA256. Failed deliveries retry with backoff, then land in the dead-letter queue for manual replay.</p>
        </Panel>
        <Panel title="Recent requests" className="xl:col-span-2" pad={false}>
          <ul className="divide-y divide-white/[0.04] font-mono text-[12px]">
            {requests.map(([m, p, c, ms], i) => (
              <li key={i} className="flex items-center gap-4 px-5 py-3">
                <span className={`w-12 font-semibold ${m === "POST" ? "text-neon" : "text-ok"}`}>{m}</span>
                <span className="flex-1 truncate text-paper">{p}</span>
                <span className={c >= 400 ? "text-warn" : "text-ok"}>{c}</span>
                <span className="w-14 text-right text-dim">{ms}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

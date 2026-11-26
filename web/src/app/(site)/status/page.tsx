import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { Reveal } from "@/components/fx/Reveal";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { DASHBOARD_URL } from "@/lib/dashboard-url";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "PayXa System Status & Service Health",
  description:
    "Real-time operational status for PayXa services: Central API, Checkout, Webhook delivery, and Merchant Dashboard.",
  alternates: { canonical: `${site.url}/status` },
  openGraph: {
    title: "PayXa System Status & Service Health",
    description: "Live operational status of the PayXa payment automation platform.",
    url: `${site.url}/status`,
    images: [{ url: `${site.url}/brand/payxa-lockup.png`, width: 1200, height: 630, alt: "PayXa System Status" }],
  },
};

// Re-probe the services at most once a minute.
export const revalidate = 60;

type Health = "up" | "degraded" | "down";

const API = (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.payxa.in").replace(/\/+$/, "");

async function probe(url: string): Promise<{ health: Health; ms: number }> {
  const t = Date.now();
  try {
    // The dashboard's health check itself probes its DB and the API, so allow it time.
    const r = await fetch(url, { signal: AbortSignal.timeout(12000), next: { revalidate: 60 } });
    return { health: r.ok ? "up" : r.status < 600 ? "degraded" : "down", ms: Date.now() - t };
  } catch {
    return { health: "down", ms: Date.now() - t };
  }
}

const label: Record<Health, string> = { up: "Operational", degraded: "Degraded", down: "Unavailable" };
const tone: Record<Health, { text: string; bar: string }> = {
  up: { text: "text-ok", bar: "bg-ok/70" },
  degraded: { text: "text-warn", bar: "bg-warn/70" },
  down: { text: "text-neon", bar: "bg-crimson/70" },
};

export default async function StatusPage() {
  const [api, dash] = await Promise.all([probe(`${API}/health`), probe(`${DASHBOARD_URL.replace(/\/+$/, "")}/api/health`)]);
  const site = { health: "up" as Health, ms: 0 };

  const rows: { name: string; via: { health: Health; ms: number } }[] = [
    { name: "Public website", via: site },
    { name: "Merchant dashboard", via: dash },
    { name: "REST API", via: api },
    { name: "Checkout & payment links", via: api },
    { name: "Device event ingestion", via: api },
    { name: "Webhook delivery", via: api },
  ];

  const worst: Health = rows.some((r) => r.via.health === "down") ? "down" : rows.some((r) => r.via.health === "degraded") ? "degraded" : "up";
  const headline = worst === "up" ? "All systems\noperational." : worst === "degraded" ? "Some systems\ndegraded." : "Partial\noutage.";
  const checked = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "System Status", url: "/status" },
        ]}
      />
      <PageHero
        scene="grid"
        side="center"
        eyebrow="System status"
        title={headline}
        accentWords={worst === "up" ? ["operational."] : ["degraded.", "outage."]}
        description={`Live checks against payxa.in, dash.payxa.in and api.payxa.in. Last checked ${checked} IST, refreshed every minute.`}
      />
      <section className="container-px pb-28" data-scene="grid" data-side="center">
        <Reveal>
          <div className="card overflow-hidden">
            {rows.map((c) => (
              <div key={c.name} className="flex items-center justify-between gap-4 border-b border-white/[0.05] px-6 py-4 last:border-0">
                <span className="text-[15px]">{c.name}</span>
                <span className="flex items-center gap-4">
                  <span className="hidden gap-[3px] sm:flex" aria-hidden>
                    {Array.from({ length: 40 }).map((_, j) => (
                      <span key={j} className={`h-6 w-[5px] rounded-sm ${j === 39 ? tone[c.via.health].bar : "bg-white/[0.07]"}`} />
                    ))}
                  </span>
                  <span className={`font-mono text-[11px] tracking-[0.14em] uppercase ${tone[c.via.health].text}`}>{label[c.via.health]}</span>
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[13px] text-dim">
            Seeing a problem that isn&apos;t listed here? Email <a className="text-neon hover:underline" href="mailto:support@payxa.in">support@payxa.in</a>.
          </p>
        </Reveal>
      </section>
    </>
  );
}

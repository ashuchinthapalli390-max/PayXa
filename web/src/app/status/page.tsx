import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { Reveal } from "@/components/fx/Reveal";

export const metadata: Metadata = { title: "System status" };

const components = [
  "Public website",
  "Merchant dashboard",
  "REST API",
  "Checkout",
  "Push notifications",
  "Device event ingestion",
  "Webhook delivery",
  "Realtime gateway",
];

export default function StatusPage() {
  return (
    <>
      <PageHero
        scene="grid"
        side="center"
        eyebrow="System status"
        title={"Pre-launch.\nNo live services yet."}
        accentWords={["pre-launch."]}
        description="Live uptime and incident history will appear here once PayXa services go live. Until then, only this website is running."
      />
      <section className="container-px pb-28" data-scene="grid" data-side="center">
        <Reveal>
          <div className="card overflow-hidden">
            {components.map((c, i) => (
              <div key={c} className="flex items-center justify-between border-b border-white/[0.05] px-6 py-4 last:border-0">
                <span className="text-[15px]">{c}</span>
                <span className="flex items-center gap-4">
                  <span className="hidden gap-[3px] sm:flex" aria-hidden>
                    {Array.from({ length: 40 }).map((_, j) => (
                      <span key={j} className={`h-6 w-[5px] rounded-sm ${i === 0 ? "bg-ok/70" : "bg-white/[0.07]"}`} />
                    ))}
                  </span>
                  <span className={`font-mono text-[11px] tracking-[0.14em] uppercase ${i === 0 ? "text-ok" : "text-dim"}`}>
                    {i === 0 ? "Operational" : "Not live"}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}

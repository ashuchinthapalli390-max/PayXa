import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FlaskConical, KeyRound, ShieldCheck } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Scene from "@/components/three/Scene";
import { CodeWindow } from "@/components/home/Developers";
import ScrollTilt from "@/components/fx/ScrollTilt";
import { EventStream } from "@/components/checkout/MerchantPhone";
import Integrations from "@/components/home/Integrations";
import FinalCTA from "@/components/home/FinalCTA";
import { SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { endpoints, highlight, webhookEvents, webhookSample } from "@/lib/code";

export const metadata: Metadata = { title: "Developers" };

const webhookSecurity = [
  "HMAC-SHA256 signature",
  "Timestamp verification",
  "Delivery ID and event ID",
  "Replay protection",
  "Idempotent processing",
  "Retry with exponential backoff",
  "Dead-letter queue",
  "Manual replay for failed delivery",
  "Endpoint secret rotation",
  "Webhook testing dashboard",
];

export default function DevelopersPage() {
  return (
    <>
      <PageHero
        scene="helix"
        side="right"
        eyebrow="Developers"
        title={"APIs that respect\nyour money."}
        accentWords={["money."]}
        description="REST API, JavaScript SDK, webhooks and realtime events working as one platform. Amounts in paise. Idempotent writes. Test and live fully separated."
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/docs" className="btn btn-primary">
            Read the docs <ArrowRight size={14} />
          </Link>
          <Link href="#sandbox" className="btn btn-ghost">
            <FlaskConical size={14} /> Sandbox
          </Link>
        </div>
      </PageHero>

      <section className="container-px pb-24" data-scene="helix" data-side="center">
        <ScrollTilt>
          <CodeWindow />
          <EventStream className="mt-4" title="Script output" />
        </ScrollTilt>
      </section>

      <section id="api" data-scene="cube" data-side="left" className="section-y scroll-mt-24 border-t border-white/[0.06]">
        <div className="container-px grid grid-cols-1 [&>*]:min-w-0 gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader eyebrow="API reference" title={"Twelve endpoints.\nNo surprises."} accentWords={["twelve"]} description="The v1 REST surface at api.payxa.in, authenticated with your secret API key." />
          <Reveal>
            <div className="card overflow-hidden">
              {endpoints.map(([m, p, d]) => (
                <div key={p + m} className="grid grid-cols-[56px_1fr] gap-x-4 border-b border-white/[0.04] px-5 py-3.5 font-mono text-[13px] last:border-0 sm:grid-cols-[56px_1fr_1fr]">
                  <span className={`font-semibold ${m === "POST" ? "text-neon" : "text-ok"}`}>{m}</span>
                  <span className="text-paper">{p}</span>
                  <span className="col-start-2 font-sans text-[13px] text-muted sm:col-start-auto">{d}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="webhooks" data-scene="torus" data-side="center" className="section-y scroll-mt-24 border-t border-white/[0.06]">
        <div className="container-px">
          <SectionHeader
            eyebrow="Webhooks"
            title={"Fulfil on verified.\nNever on a callback."}
            accentWords={["verified."]}
            description="Enable product delivery, course access or account credit only after a verified webhook or an independently fetched verified state."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="card h-full overflow-hidden">
                <div className="border-b border-white/[0.06] px-5 py-3 font-mono text-[11px] text-dim">payment.verified · sample payload</div>
                <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-[1.75]" data-lenis-prevent>
                  <code>{highlight(webhookSample)}</code>
                </pre>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="card h-full p-6">
                <div className="font-mono text-[11px] tracking-[0.16em] text-dim uppercase">Event types</div>
                <ul className="mt-4 space-y-2.5">
                  {webhookEvents.map(([e, d]) => (
                    <li key={e} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-4">
                      <code className="shrink-0 font-mono text-[12.5px] text-neon sm:w-[250px]">{e}</code>
                      <span className="text-[13px] text-muted">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
          <Reveal>
            <div className="mt-6 flex flex-wrap gap-2">
              {webhookSecurity.map((w) => (
                <span key={w} className="chip">
                  <ShieldCheck size={12} className="text-ok" /> {w}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="sandbox" data-scene="shield" data-side="center" className="section-y scroll-mt-24 border-t border-white/[0.06]">
        <div className="container-px grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="card h-full p-8">
              <span className="chip !border-warn/40 !text-warn">Test mode</span>
              <h3 className="mt-6 font-display text-2xl font-semibold uppercase">Sandbox</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                Run checkouts, detections, verifications, late payments and same-amount conflicts end to end. Trigger any webhook
                from the dashboard webhook tester. No real money ever moves.
              </p>
              <div className="mt-6 font-mono text-[12px] text-dim">
                Keys look like <span className="text-paper">pxa_test_…</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card h-full p-8">
              <span className="chip !border-crimson/50 !text-neon">Live mode</span>
              <h3 className="mt-6 font-display text-2xl font-semibold uppercase">Production</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                Unlocked after business verification, receiving-account ownership checks, device diagnostics and the applicable
                partner and legal reviews.
              </p>
              <div className="mt-6 flex items-center gap-2 font-mono text-[12px] text-dim">
                <KeyRound size={14} /> Keys look like <span className="text-paper">pxa_live_…</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Scene shape="rings" side="center"><Integrations index="" /></Scene>
      <FinalCTA />
    </>
  );
}

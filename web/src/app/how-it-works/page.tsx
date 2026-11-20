import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import HowItWorks from "@/components/home/HowItWorks";
import CheckoutExperience from "@/components/home/CheckoutExperience";
import ScriptToSuccess from "@/components/home/ScriptToSuccess";
import Scene from "@/components/three/Scene";
import FinalCTA from "@/components/home/FinalCTA";
import { SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";

export const metadata: Metadata = { title: "How it works" };

const states = [
  { s: "CHECKOUT_STARTED", d: "Session created, merchant alerted", c: "border-crimson/50 text-neon" },
  { s: "PAYMENT_DETECTED", d: "Credit evidence matched to one order", c: "border-warn/50 text-warn" },
  { s: "VERIFYING", d: "Waiting for trusted bank/PSP confirmation", c: "border-warn/50 text-warn" },
  { s: "PAYMENT_VERIFIED", d: "Trusted confirmation received", c: "border-ok/50 text-ok" },
];
const side = [
  { s: "NEEDS_REVIEW", d: "Ambiguous or conflicting evidence" },
  { s: "LATE_DETECTED", d: "Payment arrived after expiry" },
  { s: "EXPIRED", d: "No verified payment in time" },
];

const rules: [string, string][] = [
  ["Notification received", "Payment evidence detected"],
  ["Amount matches", "Candidate match only"],
  ["UTR matches order reference", "Stronger correlation, not automatically authoritative"],
  ["Multiple same-amount orders", "Review unless uniquely identifiable"],
  ["Trusted bank/PSP confirms", "Payment verified"],
  ["SMS or notification late", "Keep reconciling"],
  ["Phone offline", "Continue via available trusted sources"],
  ["Payment after expiry", "Late-payment exception"],
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title={"From tap to\ntrusted. Step by step."}
        accentWords={["trusted."]}
        description="PayXa connects your checkout, your phone and trusted payment sources so everyone sees the same, server-authoritative status."
        scene="grid"
        side="center"
      />
      <Scene shape="grid" side="center">
        <HowItWorks />
      </Scene>
      <ScriptToSuccess />
      <section className="section-y" data-scene="helix" data-side="right">
        <div className="container-px">
          <SectionHeader
            eyebrow="Payment state machine"
            title={"Every payment has\none true state."}
            accentWords={["true"]}
            description="States only move forward on evidence. A backend failure never silently turns a transaction into a success."
          />
          <div className="mt-14 grid gap-3 lg:grid-cols-4">
            {states.map((x, i) => (
              <Reveal key={x.s} delay={i * 0.08}>
                <div className={`relative h-full rounded-2xl border bg-surface/60 p-6 ${x.c.split(" ")[0]}`}>
                  <span className="font-mono text-[10px] text-dim">STATE {i + 1}</span>
                  <div className={`mt-4 font-mono text-[13px] font-semibold ${x.c.split(" ")[1]}`}>{x.s}</div>
                  <p className="mt-2 text-[14px] text-muted">{x.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {side.map((x, i) => (
              <Reveal key={x.s} delay={0.3 + i * 0.06}>
                <div className="rounded-2xl border border-dashed border-white/15 p-5">
                  <div className="font-mono text-[12px] font-semibold text-paper">{x.s}</div>
                  <p className="mt-1 text-[13px] text-muted">{x.d}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="card mt-16 overflow-hidden">
              <div className="grid grid-cols-2 border-b border-white/[0.06] px-6 py-4 font-mono text-[11px] tracking-[0.16em] text-dim uppercase">
                <span>Condition</span>
                <span>Result</span>
              </div>
              {rules.map(([a, b]) => (
                <div key={a} className="grid grid-cols-2 gap-4 border-b border-white/[0.04] px-6 py-4 text-[14px] last:border-0">
                  <span className="text-paper">{a}</span>
                  <span className={b === "Payment verified" ? "text-ok" : "text-muted"}>{b}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      <Scene shape="rings" side="center">
        <CheckoutExperience />
      </Scene>
      <FinalCTA />
    </>
  );
}

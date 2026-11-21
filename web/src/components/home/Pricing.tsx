import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import ScrollTilt from "@/components/fx/ScrollTilt";

const included = [
  "Merchant dashboard",
  "UPI checkout tools and payment links",
  "Android app notifications",
  "Developer API access (fair-use limits)",
  "Full sandbox environment",
  "Basic reports and CSV export",
];

export default function Pricing({ index = "11" }: { index?: string }) {
  return (
    <section className="section-y relative overflow-hidden">
      <div className="container-px">
        <SectionHeader
          index={index}
          eyebrow="Pricing"
          title={"Zero platform fee.\nNo fine print games."}
          accentWords={["zero"]}
          align="center"
        />

        <div className="mx-auto mt-16 grid grid-cols-1 [&>*]:min-w-0 max-w-5xl gap-6 lg:grid-cols-[1.4fr_1fr]">
          <ScrollTilt>
            <div className="relative overflow-hidden rounded-[24px] border border-crimson/40 bg-gradient-to-b from-crimson/[0.12] via-surface to-surface p-8 shadow-[0_40px_120px_-40px_rgba(217,4,41,0.4)] sm:p-10">
              <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full border border-crimson/30" />
              <div className="pointer-events-none absolute -top-10 -right-10 size-44 rounded-full border border-crimson/20" />
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-semibold tracking-wide uppercase">Free Starter</span>
                <span className="chip !border-crimson/50 !text-paper">Proposed V1</span>
              </div>
              <div className="mt-8 flex items-end gap-3">
                <span className="font-display text-[96px] leading-none font-bold tracking-tighter sm:text-[120px]">₹0</span>
                <span className="mb-4 text-[14px] text-muted">
                  PayXa platform fee
                  <br />
                  per transaction
                </span>
              </div>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {included.map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px]">
                    <Check size={16} className="mt-0.5 shrink-0 text-neon" /> {i}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn btn-primary mt-10 w-full sm:w-auto">
                Start free <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollTilt>
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col rounded-[24px] border border-white/[0.08] bg-surface/60 p-8">
              <span className="font-display text-sm font-semibold tracking-wide text-muted uppercase">Business plans</span>
              <div className="mt-8 font-display text-4xl font-bold">Later</div>
              <p className="mt-4 text-[14px] leading-relaxed text-muted">
                Optional plans for teams, advanced analytics and multiple verified UPI accounts may come after V1, once free-tier
                costs are understood.
              </p>
              <div className="mt-auto rounded-2xl border border-white/[0.06] bg-ink/60 p-5 pt-5">
                <div className="eyebrow !text-warn">Please note</div>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  Bank or PSP charges, applicable taxes and provider fees are separate. ₹0 is proposed PayXa pricing, not a promise
                  that every transaction is completely free. Merchant tax obligations still apply.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

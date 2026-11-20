import type { Metadata } from "next";
import Link from "next/link";
import { BellRing, Code2, CreditCard, Search, Smartphone, UserCog, Wallet } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Scene from "@/components/three/Scene";
import FAQ from "@/components/home/FAQ";
import { Reveal } from "@/components/fx/Reveal";
import { SpotlightCard } from "@/components/fx/Interactive";

export const metadata: Metadata = { title: "Help center" };

const topics = [
  { icon: UserCog, t: "Account & onboarding", d: "Sign-up, verification, receiving UPI setup", href: "/docs#quickstart" },
  { icon: Smartphone, t: "Merchant app", d: "Pairing, permissions, diagnostics", href: "/download" },
  { icon: BellRing, t: "Alerts not arriving", d: "Battery optimisation, tokens, offline", href: "/docs#devices" },
  { icon: Wallet, t: "Payments & review", d: "Detected vs verified, late, duplicates", href: "/how-it-works" },
  { icon: Code2, t: "Integrations", d: "API keys, webhooks, sandbox", href: "/developers" },
  { icon: CreditCard, t: "Fees & refunds", d: "What PayXa charges and does not", href: "/pricing" },
];

export default function HelpPage() {
  return (
    <>
      <PageHero scene="torus" side="right" eyebrow="Help center" title={"How can we\nhelp?"} accentWords={["help?"]}>
        <div className="mt-10 flex max-w-xl items-center gap-3 rounded-full border border-white/10 bg-surface/70 px-5 py-3.5 focus-within:border-neon">
          <Search size={18} className="text-dim" />
          <input
            type="search"
            placeholder="Search help articles (coming soon)"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-dim"
            aria-label="Search help"
          />
        </div>
      </PageHero>
      <section className="container-px pb-10" data-scene="cube" data-side="center">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((x, i) => (
            <Reveal key={x.t} delay={(i % 3) * 0.06}>
              <Link href={x.href} className="block h-full">
                <SpotlightCard className="h-full p-7">
                  <x.icon size={20} className="text-neon" />
                  <div className="mt-6 font-display text-[15px] font-semibold uppercase">{x.t}</div>
                  <p className="mt-2 text-[14px] text-muted">{x.d}</p>
                </SpotlightCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <Scene shape="rings" side="left"><FAQ index="" /></Scene>
    </>
  );
}

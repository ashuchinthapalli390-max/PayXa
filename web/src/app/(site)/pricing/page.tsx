import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Scene from "@/components/three/Scene";
import Pricing from "@/components/home/Pricing";
import FAQ from "@/components/home/FAQ";
import FinalCTA from "@/components/home/FinalCTA";
import { Reveal } from "@/components/fx/Reveal";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "PayXa Pricing — Transparent ₹0 Platform Fee",
  description:
    "PayXa charges ₹0 platform fees on the V1 Free Starter plan. PayXa does not hold or settle funds, so there are no settlement commissions.",
  alternates: { canonical: `${site.url}/pricing` },
  openGraph: {
    title: "PayXa Pricing — Transparent ₹0 Platform Fee",
    description: "Proposed V1 Free Starter plan with ₹0 PayXa platform fee.",
    url: `${site.url}/pricing`,
    images: [{ url: `${site.url}/brand/payxa-lockup.png`, width: 1200, height: 630, alt: "PayXa Pricing" }],
  },
};

const rows: [string, string, string][] = [
  ["PayXa platform fee", "₹0", "Free Starter plan"],
  ["Bank / PSP charges", "As charged", "Set by your bank or payment partner"],
  ["Applicable taxes", "As applicable", "Including GST where it applies"],
  ["Third-party provider fees", "As charged", "If you use a provider that charges"],
  ["API usage", "Fair use", "Generous limits; rate limits published in docs"],
];

export default function PricingPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Pricing", url: "/pricing" },
        ]}
      />
      <PageHero
        scene="rupee"
        side="right"
        eyebrow="Pricing"
        title={"Simple pricing.\nHonest disclosures."}
        accentWords={["honest"]}
        description="PayXa does not hold your money, so there is no settlement cut to take. Here is exactly what is and is not included."
      />
      <Scene shape="rupee" side="center"><Pricing index="01" /></Scene>
      <section className="container-px pb-24" data-scene="cube" data-side="right">
        <Reveal>
          <div className="card mx-auto max-w-5xl overflow-hidden">
            <div className="border-b border-white/[0.06] px-6 py-5 font-display text-sm font-semibold uppercase">Fee disclosures</div>
            {rows.map(([a, b, c]) => (
              <div key={a} className="grid gap-1 border-b border-white/[0.04] px-6 py-4 text-[14px] last:border-0 sm:grid-cols-[1.2fr_0.6fr_1.5fr] sm:gap-4">
                <span className="text-paper">{a}</span>
                <span className="font-mono text-neon">{b}</span>
                <span className="text-muted">{c}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
      <Scene shape="rings" side="left"><FAQ index="02" limit={6} /></Scene>
      <FinalCTA />
    </>
  );
}

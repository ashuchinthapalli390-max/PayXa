import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import ProductShowcase from "@/components/home/ProductShowcase";
import FinalCTA from "@/components/home/FinalCTA";
import { productLinks } from "@/lib/site";
import { Reveal } from "@/components/fx/Reveal";
import { SpotlightCard } from "@/components/fx/Interactive";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="PayXa products"
        title={"Everything to accept\nUPI, connected."}
        accentWords={["connected."]}
        description="Checkout, links, QR, instant alerts, developer tools, a merchant dashboard and reconciliation. Each one works alone and better together."
        scene="cube"
      />
      <section className="container-px pb-10" data-scene="qr" data-side="right">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {productLinks.map((p, i) => (
            <Reveal key={p.href} delay={i * 0.06}>
              <Link href={p.href} className="block h-full">
                <SpotlightCard className="group h-full p-7">
                  <span className="font-mono text-[11px] text-dim">0{i + 1}</span>
                  <h2 className="mt-10 font-display text-lg font-semibold uppercase">{p.label}</h2>
                  <p className="mt-2 text-[14px] text-muted">{p.desc}</p>
                  <ArrowUpRight size={18} className="mt-8 text-neon transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </SpotlightCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <div data-scene="rings" data-side="left">
        <ProductShowcase />
      </div>
      <FinalCTA />
    </>
  );
}

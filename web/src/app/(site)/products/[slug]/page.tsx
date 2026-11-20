import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Info } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import FinalCTA from "@/components/home/FinalCTA";
import { productDetails } from "@/lib/products";
import { Reveal } from "@/components/fx/Reveal";
import { SpotlightCard } from "@/components/fx/Interactive";
import { SectionHeader } from "@/components/ui/Section";
import HorizontalRail from "@/components/fx/HorizontalRail";
import Scene from "@/components/three/Scene";
import type { Shape } from "@/components/three/sceneStore";

const heroScene: Record<string, Shape> = {
  checkout: "qr",
  "payment-links": "rings",
  "qr-payments": "qr",
  "instant-alerts": "phone",
};

export function generateStaticParams() {
  return productDetails.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = productDetails.find((x) => x.slug === slug);
  return { title: p ? p.eyebrow.replace("Product · ", "") : "Product" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = productDetails.find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} accentWords={p.accent} description={p.description} scene={heroScene[p.slug] ?? "rings"}>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/register" className="btn btn-primary">
            Start free <ArrowRight size={14} />
          </Link>
          <Link href="/docs" className="btn btn-ghost">
            Read the docs
          </Link>
        </div>
      </PageHero>

      <Scene shape="torus" side="center">
        <section className="pb-24">
          <HorizontalRail
            header={<SectionHeader eyebrow="Features" title={"What you get."} accentWords={["get."]} />}
            items={p.features.map((f, i) => (
              <SpotlightCard key={f.title} className="h-[300px] p-8">
                <span className="font-display text-5xl font-bold text-crimson/40">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-10 font-display text-lg font-semibold uppercase">{f.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{f.body}</p>
              </SpotlightCard>
            ))}
          />
          {p.note && (
            <div className="container-px">
              <Reveal>
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-warn/30 bg-warn/[0.06] p-5 text-[14px] text-muted">
                  <Info size={18} className="mt-0.5 shrink-0 text-warn" /> {p.note}
                </div>
              </Reveal>
            </div>
          )}
        </section>
      </Scene>

      <section className="section-y relative border-t border-white/[0.06]" data-scene="helix" data-side="center">
        <div className="container-px">
          <SectionHeader eyebrow="Flow" title="How it moves." accentWords={["moves."]} />
          <ol className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {p.flow.map((s, i) => (
              <Reveal key={s} as="li" delay={i * 0.07}>
                <div className="relative h-full rounded-2xl border border-white/[0.07] bg-surface/60 p-5">
                  <span className="font-display text-3xl font-bold text-crimson/40">{i + 1}</span>
                  <p className="mt-6 text-[14px] text-paper">{s}</p>
                  {i < p.flow.length - 1 && (
                    <span className="absolute top-1/2 -right-2 hidden size-4 -translate-y-1/2 rotate-45 border-t border-r border-crimson/60 lg:block" />
                  )}
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}

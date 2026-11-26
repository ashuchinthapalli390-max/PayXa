import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Download, ExternalLink, CheckCircle } from "lucide-react";
import PageHero, { Prose } from "@/components/ui/PageHero";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Reveal } from "@/components/fx/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Official Brand Assets, Logo & Identity",
  description:
    "Official brand assets, logos, color codes, spelling guidelines, and disambiguation details for PayXa, developed by CodeXa Agency.",
  alternates: { canonical: `${site.url}/brand` },
  openGraph: {
    title: "PayXa Official Brand Assets & Guidelines",
    description: "Official logos, wordmarks, brand guidelines and identity for PayXa.",
    url: `${site.url}/brand`,
    images: [{ url: `${site.url}/brand/payxa-lockup.png`, width: 1200, height: 630, alt: "PayXa Brand Media Kit" }],
  },
};

const brandAssets = [
  {
    title: "PayXa Brand Lockup",
    desc: "Primary official lockup featuring the PayXa geometric emblem and bold typographic wordmark.",
    src: "/brand/payxa-lockup.png",
    format: "PNG (Hi-Res)",
    dimensions: "720 × 720 px",
  },
  {
    title: "PayXa Icon / Emblem",
    desc: "Hexagonal payment vertex mark used for app icons, favicons, and avatar symbols.",
    src: "/brand/payxa-mark.png",
    format: "PNG (Hi-Res)",
    dimensions: "512 × 512 px",
  },
  {
    title: "PayXa Typographic Wordmark",
    desc: "Standalone modern typographic logo with crisp geometry and razor-sharp kerning.",
    src: "/brand/payxa-wordmark.png",
    format: "PNG (Hi-Res)",
    dimensions: "512 × 128 px",
  },
];

const colors = [
  { name: "Ink / Obsidian", hex: "#010101", usage: "Primary background" },
  { name: "Surface Card", hex: "#0A0A0A", usage: "Elevated containers & cards" },
  { name: "Paper White", hex: "#EDEDED", usage: "High-contrast headings & primary text" },
  { name: "PayXa Crimson", hex: "#FF2E51", usage: "Primary accent & active state highlights" },
  { name: "Neon Coral", hex: "#FF4767", usage: "Interactive links & gradients" },
  { name: "Muted Mono", hex: "#737373", usage: "Secondary text & labels" },
];

export default function BrandPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Brand Guidelines", url: "/brand" },
        ]}
      />
      <PageHero
        scene="rings"
        side="right"
        eyebrow="Media kit & identity"
        title={"Official PayXa\nbrand assets."}
        accentWords={["assets."]}
        description="Download verified PayXa logos, read typography and color specifications, and access official brand disambiguation guidance."
      />

      {/* Brand Identity & Spelling Standards */}
      <section className="container-px pb-16" data-scene="cube" data-side="center">
        <div className="card p-8 md:p-12">
          <div className="max-w-3xl">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-paper">
              Official Brand Spelling & Nomenclature
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              The official name of the software platform is <strong className="text-paper">PayXa</strong> (capital &ldquo;P&rdquo;, lowercase &ldquo;ay&rdquo;, capital &ldquo;X&rdquo;, lowercase &ldquo;a&rdquo;).
              Please do not spell the brand as &ldquo;PayXA&rdquo;, &ldquo;Payxa&rdquo;, &ldquo;Pay X A&rdquo;, or &ldquo;Pay-Xa&rdquo;.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-4 py-2 font-mono text-sm text-emerald-400">
                <CheckCircle size={16} /> PayXa (Correct)
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/20 px-4 py-2 font-mono text-sm text-red-400 line-through">
                PayXA / Payxa / Pay X A
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Downloadable Assets */}
      <section className="container-px pb-20">
        <div className="eyebrow mb-6">Downloadable Assets</div>
        <div className="grid gap-6 md:grid-cols-3">
          {brandAssets.map((asset, i) => (
            <Reveal key={asset.title} delay={i * 0.08}>
              <div className="card flex h-full flex-col justify-between overflow-hidden p-6">
                <div>
                  <div className="relative mb-6 grid aspect-square place-items-center rounded-xl border border-white/[0.06] bg-black/60 p-6">
                    <Image
                      src={asset.src}
                      alt={asset.title}
                      width={300}
                      height={300}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="font-display text-lg font-semibold uppercase text-paper">{asset.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{asset.desc}</p>
                </div>
                <div className="mt-6 border-t border-white/[0.06] pt-4">
                  <div className="flex items-center justify-between font-mono text-xs text-dim">
                    <span>{asset.format}</span>
                    <span>{asset.dimensions}</span>
                  </div>
                  <a
                    href={asset.src}
                    download
                    className="btn btn-secondary mt-4 w-full justify-center gap-2 text-xs"
                  >
                    <Download size={14} /> Download Asset
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Color Palette */}
      <section className="container-px pb-20">
        <div className="eyebrow mb-6">Color System</div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {colors.map((c) => (
            <div key={c.hex} className="card flex items-center gap-4 p-5">
              <div
                className="h-12 w-12 shrink-0 rounded-lg border border-white/10"
                style={{ backgroundColor: c.hex }}
              />
              <div>
                <div className="font-display text-sm font-semibold text-paper">{c.name}</div>
                <div className="font-mono text-xs text-neon">{c.hex}</div>
                <div className="text-xs text-muted">{c.usage}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Entity & Organization Relationship */}
      <section className="container-px pb-28">
        <div className="card p-8 md:p-12">
          <Prose>
            <h2>Organization & Developer Relationship</h2>
            <p>
              PayXa is designed, engineered, and maintained by <strong className="text-paper">CodeXa Agency</strong> (<Link href="https://codexa.agency" className="text-neon inline-flex items-center gap-1" target="_blank" rel="noopener noreferrer">codexa.agency <ExternalLink size={12} /></Link>).
              PayXa is an independent platform product tailored for Indian merchants, startups, and developers to automate direct UPI payments.
            </p>
            <h2>Official Disambiguation Notice</h2>
            <p>
              PayXa (<strong>https://payxa.in</strong>) has NO connection to:
            </p>
            <ul>
              <li>&ldquo;Payaxa&rdquo; — a Sri Lankan prepaid DTH recharge and utility payment website (<code className="text-xs">payaxa.lk</code>).</li>
              <li>Any third-party video entertainment, TikTok, or social media channels using phonetically similar terms.</li>
              <li>Unlicensed money lending, pooling, or financial investment schemes.</li>
            </ul>
            <p>
              For security, merchants and developers must only authenticate, download APKs, and review API documentation through verified PayXa domains (<code className="text-xs">payxa.in</code>, <code className="text-xs">dash.payxa.in</code>, <code className="text-xs">api.payxa.in</code>).
            </p>
          </Prose>
        </div>
      </section>
    </>
  );
}

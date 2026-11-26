import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Zap, Shield, Smartphone, QrCode, Link2, Code, Bell } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Reveal } from "@/components/fx/Reveal";
import { SpotlightCard } from "@/components/fx/Interactive";
import FinalCTA from "@/components/home/FinalCTA";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Platform Features — Complete UPI Automation Suite",
  description:
    "Explore PayXa features: hosted UPI checkout, instant merchant phone alerts, shareable payment links, dynamic QR, developer APIs, and automatic reconciliation.",
  alternates: { canonical: `${site.url}/features` },
  openGraph: {
    title: "PayXa Platform Features — Complete UPI Automation",
    description: "Hosted UPI checkout, instant merchant phone alerts, dynamic QR, and automated reconciliation.",
    url: `${site.url}/features`,
    images: [{ url: `${site.url}/brand/payxa-lockup.png`, width: 1200, height: 630, alt: "PayXa Platform Features" }],
  },
};

const featureGrid = [
  {
    icon: Zap,
    title: "Direct-to-Account UPI",
    body: "Customer payments go directly into your verified bank account or VPA. PayXa operates without intermediary pooling, so there are zero escrow delays.",
    tag: "Core Architecture",
  },
  {
    icon: Bell,
    title: "Instant 'Payment Started' Push",
    body: "The second a customer initiates checkout on any device, registered merchant Android phones receive a push alert, preventing store bottlenecks.",
    tag: "Realtime Alerts",
  },
  {
    icon: QrCode,
    title: "Dynamic & Static QR Engine",
    body: "Display high-contrast, error-tolerant UPI QR codes. Supports dynamic amount embedding and counter standee printable kits.",
    tag: "Checkout & Counter",
  },
  {
    icon: Link2,
    title: "Shareable Payment Links",
    body: "Create customized checkout links in seconds for WhatsApp, SMS, or invoicing with custom expiry timers and customer reference tracking.",
    tag: "No-Code Commerce",
  },
  {
    icon: Shield,
    title: "Server-Authoritative Verification",
    body: "Strict separation between 'detected' payments (from phone alerts) and 'verified' transactions (confirmed via banking/PSP evidence).",
    tag: "Fraud Prevention",
  },
  {
    icon: Code,
    title: "Developer REST API & Webhooks",
    body: "Idempotent POST /v1/orders endpoints, HMAC-SHA256 signed webhooks, and drop-in JavaScript SDK for custom web and app integration.",
    tag: "Developer Platform",
  },
  {
    icon: Smartphone,
    title: "PayXa Merchant Android Companion",
    body: "Securely pairs with your dashboard via camera QR scan to sync payment events, alert cashier phones, and detect incoming credit notices.",
    tag: "Mobile Companion",
  },
  {
    icon: CheckCircle,
    title: "Smart Conflict & Duplicate Handling",
    body: "Simultaneous orders of equal amount are safely sent to a dedicated review queue instead of guessed, preventing incorrect fulfillment.",
    tag: "Reconciliation",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Features", url: "/features" },
        ]}
      />
      <PageHero
        scene="cube"
        side="right"
        eyebrow="PayXa Features"
        title={"Engineered for speed.\nBuilt on truth."}
        accentWords={["truth."]}
        description="A complete overview of PayXa capabilities — from hosted checkout and instant merchant alerts to automated reconciliation and developer APIs."
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/register" className="btn btn-primary">
            Get started free <ArrowRight size={14} />
          </Link>
          <Link href="/docs" className="btn btn-ghost">
            Read API docs
          </Link>
        </div>
      </PageHero>

      {/* Feature Grid */}
      <section className="container-px pb-24" data-scene="grid" data-side="center">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featureGrid.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <SpotlightCard className="flex h-full flex-col justify-between p-7">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-neon uppercase tracking-wider">{f.tag}</span>
                    <f.icon size={20} className="text-neon" />
                  </div>
                  <h3 className="mt-6 font-display text-base font-semibold uppercase text-paper">{f.title}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted">{f.body}</p>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="container-px pb-28">
        <div className="card overflow-hidden">
          <div className="border-b border-white/[0.08] p-6 md:p-8">
            <h2 className="font-display text-xl font-bold uppercase text-paper">
              PayXa vs Traditional Intermediary Aggregators
            </h2>
            <p className="mt-2 text-sm text-muted">
              How PayXa&apos;s direct payment automation architecture compares to traditional payment gateways.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/[0.06] bg-white/[0.02] font-mono text-xs uppercase text-dim">
                <tr>
                  <th className="p-4 md:px-6">Capability</th>
                  <th className="p-4 md:px-6 text-neon">PayXa Platform</th>
                  <th className="p-4 md:px-6">Traditional Aggregators</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                <tr>
                  <td className="p-4 md:px-6 font-semibold text-paper">Fund Settlement</td>
                  <td className="p-4 md:px-6 text-emerald-400">Direct to your bank account / VPA (Instant)</td>
                  <td className="p-4 md:px-6 text-muted">T+1 or T+2 settlement delay</td>
                </tr>
                <tr>
                  <td className="p-4 md:px-6 font-semibold text-paper">Platform Fee</td>
                  <td className="p-4 md:px-6 text-emerald-400">₹0 platform fee (Starter Plan)</td>
                  <td className="p-4 md:px-6 text-muted">1.8% to 2.5% per transaction</td>
                </tr>
                <tr>
                  <td className="p-4 md:px-6 font-semibold text-paper">Checkout Alerts</td>
                  <td className="p-4 md:px-6 text-emerald-400">Instant Payment-Started push to Android</td>
                  <td className="p-4 md:px-6 text-muted">No advance phone alert</td>
                </tr>
                <tr>
                  <td className="p-4 md:px-6 font-semibold text-paper">Customer Friction</td>
                  <td className="p-4 md:px-6 text-emerald-400">Zero app install required for customers</td>
                  <td className="p-4 md:px-6 text-muted">Redirects through external payment gateways</td>
                </tr>
                <tr>
                  <td className="p-4 md:px-6 font-semibold text-paper">Developer Experience</td>
                  <td className="p-4 md:px-6 text-emerald-400">Simple REST API, signed webhooks & SDK</td>
                  <td className="p-4 md:px-6 text-muted">Heavy SDKs and complex onboarding</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}

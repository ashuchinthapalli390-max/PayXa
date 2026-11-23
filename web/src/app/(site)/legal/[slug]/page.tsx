import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero, { Prose } from "@/components/ui/PageHero";

const docs: Record<string, { title: string; body: { h: string; p: string }[] }> = {
  terms: {
    title: "Terms of service",
    body: [
      { h: "Status", p: "These terms are a draft pending legal review and do not yet govern any live service." },
      { h: "The service", p: "PayXa provides payment technology: checkout, alerts, detection, verification tooling, APIs and webhooks. PayXa does not hold, pool or settle customer funds." },
      { h: "Merchant responsibilities", p: "Merchants are responsible for the accuracy of their business information, their receiving accounts, refunds, customer support and tax obligations." },
      { h: "Fulfilment", p: "Merchants must fulfil orders only on verified payment status, never on detected status or frontend callbacks." },
    ],
  },
  privacy: {
    title: "Privacy policy",
    body: [
      { h: "Status", p: "This policy is a draft pending legal review." },
      { h: "What we collect", p: "Account details, business details, device identifiers for paired phones, and payment event data needed to match and verify orders." },
      { h: "What we never collect", p: "UPI PINs, OTPs, bank passwords, SMS history or your email inbox." },
      { h: "Notification data", p: "With separate permission, the merchant app processes only supported payment alerts and syncs allowed fields, encrypted in transit." },
    ],
  },
  disclosures: {
    title: "Fee disclosures",
    body: [
      { h: "PayXa platform fee", p: "The Free Starter plan has a ₹0 PayXa platform fee." },
      { h: "Other charges", p: "Bank or PSP charges, applicable taxes and third-party provider fees are separate and are not set by PayXa." },
      { h: "Changes", p: "Any future paid plans will be announced in advance and will be optional." },
    ],
  },
  permissions: {
    title: "App permissions",
    body: [
      { h: "Push notifications", p: "To show Payment Started, Detected, Verified and Review alerts." },
      { h: "Notification listener", p: "Optional and requested separately. Used only to read supported payment alerts." },
      { h: "Camera", p: "Only while scanning the pairing QR." },
      { h: "Biometrics", p: "Optional app lock where the device supports it." },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(docs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: docs[slug]?.title ?? "Legal" };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = docs[slug];
  if (!d) notFound();
  return (
    <>
      <PageHero scene="cube" side="right" eyebrow="Legal · Draft" title={d.title} description="Draft pending professional legal review. Not yet in force." />
      <section className="container-px pb-28">
        <Prose>
          {d.body.map((b) => (
            <div key={b.h}>
              <h2>{b.h}</h2>
              <p className="mt-3">{b.p}</p>
            </div>
          ))}
        </Prose>
      </section>
    </>
  );
}

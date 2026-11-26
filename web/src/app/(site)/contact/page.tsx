import type { Metadata } from "next";
import { Briefcase, LifeBuoy, ShieldAlert } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { ContactForm } from "@/components/ui/Forms";
import { Reveal } from "@/components/fx/Reveal";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact PayXa — Sales, Support & Partnerships",
  description:
    "Get in touch with PayXa: merchant inquiries, bank partnerships, developer integration support, and security vulnerability disclosures.",
  alternates: { canonical: `${site.url}/contact` },
  openGraph: {
    title: "Contact PayXa — Sales, Support & Partnerships",
    description: "Contact the PayXa team for sales, integration support, and partnerships.",
    url: `${site.url}/contact`,
    images: [{ url: `${site.url}/brand/payxa-lockup.png`, width: 1200, height: 630, alt: "Contact PayXa" }],
  },
};

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ]}
      />
      <PageHero
        scene="rings"
        side="right"
        eyebrow="Contact"
        title={"Let’s talk\npayments."}
        accentWords={["payments."]}
        description="Sales, partnerships, support or security. Tell us what you need and the right person will reply."
      />
      <section className="container-px pb-28" data-scene="torus" data-side="left">
        <div className="grid grid-cols-1 [&>*]:min-w-0 gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            {[
              { icon: Briefcase, t: "Sales & partnerships", d: "Merchants, banks and PSPs interested in PayXa." },
              { icon: LifeBuoy, t: "Support", d: "Sandbox, integration and account questions." },
              { icon: ShieldAlert, t: "Security", d: "Responsible disclosure of vulnerabilities." },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 0.06}>
                <div className="card flex items-start gap-5 p-6">
                  <c.icon size={20} className="mt-0.5 text-neon" />
                  <div>
                    <div className="font-display text-[14px] font-semibold uppercase">{c.t}</div>
                    <p className="mt-1 text-[14px] text-muted">{c.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <div className="card p-6 sm:p-8">
              <ContactForm siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

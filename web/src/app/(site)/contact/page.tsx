import type { Metadata } from "next";
import { Briefcase, LifeBuoy, ShieldAlert } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { Field, PreviewForm } from "@/components/ui/Forms";
import { Reveal } from "@/components/fx/Reveal";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
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
              <PreviewForm
                submitLabel="Send message"
                notice="Thanks for reaching out. Our inbox opens at launch, so this message has not been sent yet. Please check back soon."
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Name" name="name" autoComplete="name" required />
                  <Field label="Work email" name="email" type="email" autoComplete="email" required />
                </div>
                <Field label="Company / website" name="company" />
                <Field label="How can we help?" name="message" textarea required />
              </PreviewForm>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

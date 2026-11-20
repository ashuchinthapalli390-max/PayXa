import type { Metadata } from "next";
import Image from "next/image";
import PageHero, { Prose } from "@/components/ui/PageHero";
import FinalCTA from "@/components/home/FinalCTA";
import { Reveal, WipeReveal } from "@/components/fx/Reveal";

export const metadata: Metadata = { title: "About" };

const values = [
  ["Truth over speed", "We would rather show 'verifying' than a false 'success'."],
  ["Merchant first", "Your money goes to you. We build the tools around it."],
  ["Readable by default", "Neon on the marketing site, calm clarity where money is shown."],
  ["Build in the open", "Roadmap items are labelled as roadmap. No fake badges."],
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        scene="coin"
        side="right"
        eyebrow="About PayXa"
        title={"A CodeXa Agency\necosystem product."}
        accentWords={["codexa"]}
        description="PayXa is built by CodeXa Agency to give Indian merchants a faster, clearer way to accept UPI, without handing their money to a middleman."
      />
      <section className="container-px pb-24" data-scene="rings" data-side="left">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <WipeReveal>
            <div className="relative grid aspect-square place-items-center overflow-hidden rounded-[20px] border border-white/[0.06] bg-ink">
              <div className="grid-bg absolute inset-0 opacity-30" />
              <div className="floor-grid !h-[40%]" />
              <Image src="/brand/payxa-lockup.png" alt="PayXa logo" width={720} height={720} className="relative w-[78%]" />
            </div>
          </WipeReveal>
          <Reveal>
            <Prose>
              <h2>Why we are building PayXa</h2>
              <p>
                Small merchants accept UPI every day, but they still refresh bank apps, compare amounts by hand and guess which
                payment belongs to which order. PayXa connects checkout, the merchant&apos;s phone and trusted payment sources so
                that everyone sees the same status at the same time.
              </p>
              <h2>How PayXa relates to CodeXa Agency</h2>
              <p>
                CodeXa Agency designs and engineers PayXa. PayXa shares the agency&apos;s black, crimson and white visual language,
                but it is its own product with its own roadmap, policies and support.
              </p>
              <h2>Where we are</h2>
              <p>
                PayXa is pre-launch. The sandbox and developer platform come first; live payments follow partner, legal and security
                reviews.
              </p>
            </Prose>
          </Reveal>
        </div>
      </section>
      <section className="container-px pb-28" data-scene="cube" data-side="center">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.06}>
              <div className="card h-full p-7">
                <span className="font-mono text-[11px] text-neon">0{i + 1}</span>
                <div className="mt-6 font-display text-[15px] font-semibold uppercase">{t}</div>
                <p className="mt-2 text-[14px] text-muted">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <FinalCTA />
    </>
  );
}

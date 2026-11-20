import { BellRing, Code2, Landmark, Rocket } from "lucide-react";
import { SectionHeader } from "@/components/ui/Section";
import StackCards from "@/components/fx/StackCards";

const features = [
  {
    icon: BellRing,
    title: "Instant merchant alerts",
    body: "The moment a customer starts checkout, your registered phones get a Payment Started push. No more refreshing bank apps.",
    visual: (
      <div className="space-y-2">
        {["Payment Started · ₹499", "Payment Started · ₹1,299", "Payment Verified · ₹799"].map((t, i) => (
          <div
            key={t}
            className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-[12px]"
            style={{ opacity: 1 - i * 0.28 }}
          >
            <span className="pulse-dot !size-1.5" />
            <span className="text-paper">{t}</span>
            <span className="ml-auto font-mono text-[10px] text-dim">now</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Landmark,
    title: "Direct UPI collection",
    body: "Money goes straight to your eligible receiving account. PayXa never holds or settles customer funds.",
    visual: (
      <div className="flex items-center justify-between font-mono text-[11px] text-muted">
        <span className="rounded-lg border border-white/10 px-3 py-2">Customer</span>
        <span className="relative mx-3 h-px flex-1 bg-gradient-to-r from-white/10 via-neon to-white/10">
          <span className="absolute -top-[3px] left-1/2 size-[7px] rounded-full bg-neon shadow-[0_0_10px_#ff4265]" />
        </span>
        <span className="rounded-lg border border-crimson/50 px-3 py-2 text-paper">Your bank</span>
      </div>
    ),
  },
  {
    icon: Code2,
    title: "Developer friendly",
    body: "A clean REST API, a drop-in checkout script, signed webhooks and a sandbox that behaves like production.",
    visual: (
      <pre className="overflow-hidden rounded-xl border border-white/[0.06] bg-black/40 px-4 py-3 font-mono text-[12px] leading-relaxed">
        <span className="tok-k">POST</span> <span className="tok-f">/v1/orders</span>
        {"\n"}
        <span className="tok-p">{"{ "}</span>
        <span className="tok-s">&quot;amount&quot;</span>
        <span className="tok-p">: </span>
        <span className="tok-n">49900</span>
        <span className="tok-p">, </span>
        <span className="tok-s">&quot;currency&quot;</span>
        <span className="tok-p">: </span>
        <span className="tok-s">&quot;INR&quot;</span>
        <span className="tok-p">{" }"}</span>
      </pre>
    ),
  },
  {
    icon: Rocket,
    title: "Simple setup",
    body: "Create an account, connect your receiving UPI, pair the Android app with a QR and you are taking test payments in minutes.",
    visual: (
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={`h-1.5 flex-1 rounded-full ${n < 4 ? "bg-crimson" : "bg-white/10"}`} />
        ))}
        <span className="ml-2 font-mono text-[10px] text-muted">3/4</span>
      </div>
    ),
  },
];

export default function WhyPayxa() {
  return (
    <section className="section-y relative" data-scene="cube" data-side="center">
      <div className="container-px grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] [&>*]:min-w-0">
        <div className="lg:sticky lg:top-[calc(var(--nav-h)+40px)] lg:self-start">
          <SectionHeader
            index="05"
            eyebrow="Why PayXa"
            title={"Built for the moment\nmoney moves."}
            accentWords={["money", "moves."]}
            description="Four things merchants told us they wanted from UPI acceptance, built into one connected platform."
          />
        </div>
        <StackCards
          items={features.map((f, i) => (
            <div
              key={f.title}
              className="card noise overflow-hidden bg-[linear-gradient(160deg,#1a171d,#0b0a0d)] p-8 shadow-[0_-30px_80px_-40px_rgba(0,0,0,0.9)] sm:p-10"
            >
              <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-crimson/15 blur-[70px]" />
              <div className="relative flex items-start justify-between">
                <span className="grid size-14 place-items-center rounded-2xl border border-crimson/30 bg-crimson/10 text-neon">
                  <f.icon size={24} />
                </span>
                <span className="font-display text-5xl font-bold text-white/[0.06]">0{i + 1}</span>
              </div>
              <h3 className="relative mt-10 font-display text-2xl font-semibold uppercase sm:text-3xl">{f.title}</h3>
              <p className="relative mt-3 max-w-md text-[15px] leading-relaxed text-muted">{f.body}</p>
              <div className="relative mt-10">{f.visual}</div>
            </div>
          ))}
        />
      </div>
    </section>
  );
}

import { CountUp } from "@/components/fx/Interactive";
import { Reveal } from "@/components/fx/Reveal";

const items = [
  { to: 500, prefix: "< ", suffix: "ms", label: "Checkout event stored", note: "P95 target" },
  { to: 200, prefix: "< ", suffix: "ms", label: "Push job enqueued", note: "P95 target" },
  { to: 500, prefix: "< ", suffix: "ms", label: "Backend matching", note: "P95 target" },
  { to: 1, prefix: "< ", suffix: "s", label: "Verified update on site", note: "P95 target" },
];

export default function Metrics() {
  return (
    <section className="relative border-y border-white/[0.06] bg-surface/40">
      <div className="container-px grid grid-cols-2 lg:grid-cols-4">
        {items.map((m, i) => (
          <Reveal
            key={m.label}
            delay={i * 0.08}
            className={`border-white/[0.06] px-2 py-12 sm:px-6 lg:py-16 ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b lg:border-b-0" : ""} ${i === 1 ? "lg:border-r" : ""}`}
          >
            <div className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              <CountUp to={m.to} prefix={m.prefix} suffix={m.suffix} />
            </div>
            <div className="mt-3 text-[14px] text-paper">{m.label}</div>
            <div className="mt-1 font-mono text-[10px] tracking-[0.18em] text-dim uppercase">{m.note}</div>
          </Reveal>
        ))}
      </div>
      <p className="container-px pb-6 text-center font-mono text-[10px] tracking-[0.14em] text-dim uppercase">
        Engineering targets, not guaranteed real-world timings. External provider steps are not included.
      </p>
    </section>
  );
}

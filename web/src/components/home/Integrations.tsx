import { Blocks, Braces, Globe, Link2, Radio, ShoppingCart, Smartphone, Webhook, Zap, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";

const ready: { icon: LucideIcon; name: string; note: string }[] = [
  { icon: Braces, name: "REST API", note: "Orders, sessions, payments" },
  { icon: Zap, name: "JavaScript SDK", note: "Open checkout, live states" },
  { icon: Webhook, name: "Webhooks", note: "Signed, retried, replayable" },
  { icon: Radio, name: "Realtime API", note: "SSE / WebSocket updates" },
  { icon: Globe, name: "Hosted Checkout", note: "No frontend code needed" },
  { icon: Link2, name: "Payment Links", note: "Share anywhere" },
];

const planned: { icon: LucideIcon; name: string; when: string }[] = [
  { icon: ShoppingCart, name: "WooCommerce plugin", when: "V2" },
  { icon: Smartphone, name: "Android SDK", when: "V2" },
  { icon: Blocks, name: "Flutter SDK", when: "V2" },
];

export default function Integrations({ index = "10" }: { index?: string }) {
  return (
    <section className="section-y relative">
      <div className="container-px">
        <SectionHeader
          index={index}
          eyebrow="Integration ecosystem"
          title={"Plug in. Today\nand tomorrow."}
          accentWords={["today"]}
          description="What is planned for V1 and what is on the roadmap are kept clearly separate. We do not call anything ready before it is."
        />
        <div className="mt-14 grid grid-cols-1 [&>*]:min-w-0 gap-6 lg:grid-cols-[2fr_1fr]">
          <Reveal>
            <div className="card h-full p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="eyebrow !text-paper">V1 · In development</span>
                <span className="chip !py-1 !text-[10px]">
                  <span className="size-1.5 rounded-full bg-ok" /> Core
                </span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {ready.map((r) => (
                  <div
                    key={r.name}
                    className="group rounded-2xl border border-white/[0.06] bg-ink/60 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-crimson/40"
                  >
                    <r.icon size={20} className="text-neon transition-transform duration-500 group-hover:scale-110" />
                    <div className="mt-4 font-display text-[13px] font-semibold uppercase">{r.name}</div>
                    <div className="mt-1 text-[13px] text-muted">{r.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-[20px] border border-dashed border-white/15 p-6 sm:p-8">
              <span className="eyebrow">Planned · Roadmap</span>
              <div className="mt-6 space-y-3">
                {planned.map((p) => (
                  <div key={p.name} className="flex items-center gap-4 rounded-2xl border border-white/[0.05] p-4 opacity-80">
                    <p.icon size={18} className="text-dim" />
                    <span className="text-[14px]">{p.name}</span>
                    <span className="ml-auto rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-dim">{p.when}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[13px] leading-relaxed text-dim">
                Roadmap items are not available yet. Timelines may change.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

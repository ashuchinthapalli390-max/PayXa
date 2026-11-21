"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { RealQR, ScannerFrame } from "@/components/checkout/RealQR";
import { getLenis } from "@/components/fx/SmoothScroll";
import { sceneStore, type Shape } from "@/components/three/sceneStore";
import {
  AtSign,
  Smartphone,
  ArrowUpRight,
  BellRing,
  Code2,
  GitMerge,
  LayoutDashboard,
  Link2,
  QrCode,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import ScrollTilt from "@/components/fx/ScrollTilt";

const productShapes: Shape[] = ["qr", "phone", "rings", "helix", "bars", "shield"];

function MaybeTilt({ on, children }: { on: boolean; children: React.ReactNode }) {
  return on ? <ScrollTilt>{children}</ScrollTilt> : <div>{children}</div>;
}

type Product = { id: string; icon: LucideIcon; name: string; line: string; points: string[]; href: string };

const products: Product[] = [
  {
    id: "checkout",
    icon: QrCode,
    name: "UPI Checkout",
    line: "Hosted checkout with QR, UPI app launch and live payment state.",
    points: ["Validated session QR", "Installed UPI app options", "Countdown and retry protection"],
    href: "/products/checkout",
  },
  {
    id: "app",
    icon: BellRing,
    name: "Merchant App",
    line: "Android companion that alerts you and detects supported credit notifications.",
    points: ["Payment Started push", "Permission-scoped detection", "Offline queue with retry"],
    href: "/download",
  },
  {
    id: "links",
    icon: Link2,
    name: "Payment Links",
    line: "Share a checkout over WhatsApp, SMS or email. No website required.",
    points: ["One-tap creation", "Expiry and single-use", "Live status per link"],
    href: "/products/payment-links",
  },
  {
    id: "dev",
    icon: Code2,
    name: "Developer Tools",
    line: "API keys, a checkout script, signed webhooks and a full sandbox.",
    points: ["Test and live keys", "HMAC-SHA256 webhooks", "Delivery logs and replay"],
    href: "/developers",
  },
  {
    id: "dash",
    icon: LayoutDashboard,
    name: "Dashboard",
    line: "Payments, orders, devices and analytics in one fast, readable workspace.",
    points: ["Live activity feed", "Device health", "CSV export"],
    href: "/products",
  },
  {
    id: "recon",
    icon: GitMerge,
    name: "Reconciliation",
    line: "Late, duplicate and unmatched payments surfaced for review, never guessed.",
    points: ["Same-amount conflict review", "Late payment exceptions", "Full event history"],
    href: "/how-it-works",
  },
];

function Visual({ id }: { id: string }) {
  switch (id) {
    case "checkout":
      return (
        <div className="mx-auto w-full max-w-[300px] rounded-2xl border border-white/10 bg-ink p-5">
          <div className="text-[12px] text-muted">Paying CodeXa Agency</div>
          <div className="mt-1 font-display text-3xl font-semibold">₹1,299.00</div>
          <ScannerFrame className="mx-auto mt-5 w-[86%]">
            <RealQR />
          </ScannerFrame>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              { l: "Scan QR", i: QrCode },
              { l: "UPI app", i: Smartphone },
              { l: "UPI ID", i: AtSign },
            ].map((a) => (
              <span key={a.l} className="flex flex-col items-center gap-1 rounded-lg border border-white/10 py-2 text-center text-[10px] text-muted">
                <a.i size={14} className="text-neon" />
                {a.l}
              </span>
            ))}
          </div>
          <div className="btn btn-primary mt-4 w-full">Pay with UPI app</div>
        </div>
      );
    case "app":
      return (
        <div className="mx-auto w-full max-w-[300px] space-y-2.5">
          {[
            ["Payment Started", "₹499.00 · PXA-20481", "border-crimson/40 text-neon"],
            ["Incoming Credit Detected", "₹1,299.00 · Verifying", "border-warn/40 text-warn"],
            ["Payment Verified", "₹799.00 · Successful", "border-ok/40 text-ok"],
          ].map(([t, s, c], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`rounded-2xl border bg-surface p-4 ${c.split(" ")[0]}`}
            >
              <div className={`text-[13px] font-semibold ${c.split(" ")[1]}`}>{t}</div>
              <div className="mt-1 text-[13px] text-paper">{s}</div>
            </motion.div>
          ))}
        </div>
      );
    case "links":
      return (
        <div className="mx-auto w-full max-w-[340px] rounded-2xl border border-white/10 bg-ink p-5">
          <div className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">New payment link</div>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-white/10 px-4 py-3 text-[14px]">Workshop seat · ₹2,500</div>
            <div className="flex items-center gap-2 rounded-xl border border-crimson/40 bg-crimson/5 px-4 py-3 font-mono text-[12px] text-paper">
              <Link2 size={14} className="text-neon" /> pay.payxa.example/l/ws-2500
            </div>
            <div className="grid grid-cols-3 gap-2 text-center font-mono text-[10px] text-muted">
              <span className="rounded-lg bg-white/[0.03] py-2">Views 18</span>
              <span className="rounded-lg bg-white/[0.03] py-2">Started 6</span>
              <span className="rounded-lg bg-ok/10 py-2 text-ok">Paid 4</span>
            </div>
          </div>
        </div>
      );
    case "dev":
      return (
        <pre className="mx-auto w-full max-w-[380px] overflow-hidden rounded-2xl border border-white/10 bg-ink p-5 font-mono text-[12px] leading-relaxed">
          <span className="tok-c">{"// webhook: payment.verified"}</span>
          {"\n"}
          <span className="tok-k">const</span> <span className="tok-f">ok</span> <span className="tok-p">=</span>{" "}
          <span className="tok-f">payxa.webhooks.verify</span>
          <span className="tok-p">(</span>
          {"\n  "}
          <span className="tok-f">rawBody</span>
          <span className="tok-p">,</span> <span className="tok-f">signature</span>
          <span className="tok-p">,</span> <span className="tok-f">secret</span>
          {"\n"}
          <span className="tok-p">);</span>
          {"\n"}
          <span className="tok-k">if</span> <span className="tok-p">(</span>
          <span className="tok-f">ok</span>
          <span className="tok-p">)</span> <span className="tok-f">fulfil</span>
          <span className="tok-p">(</span>
          <span className="tok-f">event.data.order_id</span>
          <span className="tok-p">);</span>
        </pre>
      );
    case "dash":
      return (
        <div className="mx-auto w-full max-w-[400px] rounded-2xl border border-white/10 bg-ink p-5">
          <div className="grid grid-cols-2 gap-2">
            {[
              ["Verified volume", "₹24,950"],
              ["Verified payments", "82"],
              ["Active checkouts", "07"],
              ["Review required", "02"],
            ].map(([l, v]) => (
              <div key={l} className="rounded-xl border border-white/[0.06] bg-surface p-3">
                <div className="text-[10px] text-dim">{l}</div>
                <div className="mt-1 font-display text-lg font-semibold">{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex h-20 items-end gap-1.5 rounded-xl border border-white/[0.06] bg-surface p-3">
            {[30, 45, 38, 60, 52, 75, 64, 88, 70, 95].map((h, i) => (
              <motion.span
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.04, duration: 0.6 }}
                className="flex-1 rounded-sm bg-gradient-to-t from-crimson-deep to-crimson"
              />
            ))}
          </div>
        </div>
      );
    default:
      return (
        <div className="mx-auto w-full max-w-[380px] space-y-2">
          {[
            ["PXA-20470", "₹499", "Same-amount conflict", "text-warn"],
            ["PXA-20462", "₹1,050", "Paid after expiry", "text-warn"],
            ["PXA-20455", "₹799", "Duplicate event ignored", "text-muted"],
            ["PXA-20451", "₹2,000", "Resolved · verified", "text-ok"],
          ].map(([id, a, s, c]) => (
            <div key={id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-ink px-4 py-3 text-[13px]">
              <span className="font-mono text-[11px] text-dim">{id}</span>
              <span className="font-semibold">{a}</span>
              <span className={`text-[12px] ${c}`}>{s}</span>
            </div>
          ))}
        </div>
      );
  }
}

export default function ProductShowcase() {
  const [active, setActive] = useState(0);
  const p = products[active];
  const wrap = useRef<HTMLElement>(null);
  const [pinned, setPinned] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (min-height: 700px)");
    const on = () => setPinned(mq.matches && !reduce);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [reduce]);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!pinned) return;
    const i = Math.min(products.length - 1, Math.floor(v * products.length));
    if (i !== active) setActive(i);
    if (v > 0 && v < 1) sceneStore.set({ shape: productShapes[i], side: "left", lock: Date.now() + 500 });
  });

  const choose = (i: number) => {
    if (!pinned || !wrap.current) return setActive(i);
    const el = wrap.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + ((i + 0.5) / products.length) * (el.offsetHeight - window.innerHeight);
    const l = getLenis();
    if (l) l.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section ref={wrap} className={`relative ${pinned ? "h-[560vh]" : "section-y"}`}>
      <div className={pinned ? "sticky top-0 flex h-[100svh] flex-col justify-center pt-[var(--nav-h)]" : ""}>
      <div className="container-px w-full">
        <SectionHeader
          index="07"
          eyebrow={pinned ? "Product showcase · scroll" : "Product showcase"}
          title={"One platform.\nSix connected tools."}
          accentWords={["six"]}
        />

        <div className={`${pinned ? "mt-8" : "mt-14"} grid grid-cols-1 [&>*]:min-w-0 gap-6 lg:grid-cols-[340px_1fr]`}>
          <Reveal>
            <div role="tablist" aria-label="PayXa products" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0" data-lenis-prevent>
              {products.map((x, i) => (
                <button
                  key={x.id}
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => choose(i)}
                  className={`group relative flex shrink-0 items-center gap-4 overflow-hidden rounded-2xl border px-5 py-4 text-left transition-colors lg:py-4 ${
                    i === active ? "border-crimson/50 bg-crimson/[0.07]" : "border-white/[0.06] hover:border-white/15"
                  }`}
                >
                  {i === active && (
                    <motion.span layoutId="prod-bar" className="absolute inset-y-3 left-0 w-[3px] rounded-r bg-crimson shadow-[0_0_12px_#ff4265]" />
                  )}
                  <x.icon size={18} className={i === active ? "text-neon" : "text-dim"} />
                  <span className="font-display text-[13px] font-semibold tracking-wide uppercase">{x.name}</span>
                  <span className="ml-auto hidden font-mono text-[10px] text-dim lg:inline">0{i + 1}</span>
                </button>
              ))}
            </div>
          </Reveal>

          <MaybeTilt on={!pinned}>
            <div className={`card noise relative overflow-hidden ${pinned ? "min-h-[min(520px,62svh)]" : "min-h-[520px]"}`}>
              <div className="grid-bg absolute inset-0 opacity-30" />
              <div className="absolute -top-32 -right-32 size-96 rounded-full bg-crimson/20 blur-[100px]" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={p.id}
                  initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.3, rotateY: -12, x: 40 }}
                  animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1, rotateY: 0, x: 0 }}
                  exit={{ clipPath: "inset(0 0 0 100%)", opacity: 0.3, rotateY: 12, x: -40 }}
                  transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                  style={{ transformPerspective: 1400 }}
                  className="relative grid h-full gap-10 p-7 sm:p-10 xl:grid-cols-[1fr_1.1fr] xl:items-center"
                >
                  <div>
                    <div className="eyebrow text-neon">Product 0{active + 1}</div>
                    <h3 className="display mt-4 text-3xl sm:text-4xl">{p.name}</h3>
                    <p className="mt-4 text-[16px] leading-relaxed text-muted">{p.line}</p>
                    <ul className="mt-6 space-y-2.5">
                      {p.points.map((pt) => (
                        <li key={pt} className="flex items-center gap-3 text-[14px]">
                          <span className="size-1.5 rotate-45 bg-crimson" /> {pt}
                        </li>
                      ))}
                    </ul>
                    <Link href={p.href} className="btn btn-ghost btn-sm mt-8">
                      Learn more <ArrowUpRight size={14} />
                    </Link>
                  </div>
                  <Visual id={p.id} />
                </motion.div>
              </AnimatePresence>
            </div>
          </MaybeTilt>
        </div>
        {pinned && (
          <div className="mt-6 flex gap-1.5">
            {products.map((x, i) => (
              <span key={x.id} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= active ? "bg-crimson shadow-[0_0_8px_#ff4265]" : "bg-white/10"}`} />
            ))}
          </div>
        )}
      </div>
      </div>
    </section>
  );
}

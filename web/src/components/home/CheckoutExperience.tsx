"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { MERCHANT } from "@/lib/merchant";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { BellRing, Check, Loader2, MousePointer2, Play, Radar, ShieldCheck, ShoppingBag, Star } from "lucide-react";
import { RealQR, ScannerFrame } from "@/components/checkout/RealQR";
import { PhoneFrame, StatusBar } from "@/components/ui/Section";
import { useCheckout } from "@/components/checkout/CheckoutProvider";
import { sceneStore, type Shape } from "@/components/three/sceneStore";

const ease = [0.16, 1, 0.3, 1] as const;

/* stage boundaries along the pinned scroll */
const B = [0, 0.12, 0.28, 0.48, 0.62, 0.78, 1];
const stageOf = (p: number) => Math.min(5, Math.max(0, B.findIndex((b, i) => p >= b && p < (B[i + 1] ?? 1.01))));
const local = (p: number, s: number) => Math.min(1, Math.max(0, (p - B[s]) / (B[s + 1] - B[s])));

const captions = [
  { t: "Customer taps Pay", d: "Your store calls the PayXa script. Your server sets the price." },
  { t: "Checkout opens", d: "PayXa creates the session and pushes Payment Started to your phone." },
  { t: "Customer scans", d: "Any UPI app reads the session QR, with no app install." },
  { t: "Approves in UPI app", d: "The customer enters their UPI PIN in their own app. PayXa never sees it." },
  { t: "Credit detected", d: "Your paired phone reports the incoming credit and PayXa matches it to one order." },
  { t: "Verified", d: "A trusted bank/PSP source confirms the payment and a signed webhook tells your server to fulfil." },
];

const shapes: Shape[] = ["card", "qr", "qr", "coin", "rings", "check"];

const logLines: { s: number; text: string; tone: string }[] = [
  { s: 1, text: "POST /v1/checkout-sessions → 201 · PXA-20481", tone: "text-muted" },
  { s: 1, text: "checkout.started → push sent to 2 devices", tone: "text-neon" },
  { s: 3, text: "customer approved payment in UPI app", tone: "text-muted" },
  { s: 4, text: "payment.detected · 49900 paise · unique match", tone: "text-warn" },
  { s: 4, text: "payment.verifying · awaiting trusted source", tone: "text-warn" },
  { s: 5, text: "payment.verified · source BANK_PSP", tone: "text-ok" },
  { s: 5, text: "POST /webhooks/payxa → 200 (signed)", tone: "text-ok" },
];

function Store({ p, stage }: { p: number; stage: number }) {
  const c = local(p, 0);
  const cx = 18 + c * 34;
  const cy = 20 + c * 62;
  const clicked = stage === 0 && c > 0.85;
  return (
    <div className="absolute inset-0 p-5 sm:p-7">
      <div className="flex items-center justify-between text-[11px] text-muted">
        <span className="flex items-center gap-2 font-display text-[13px] font-semibold text-paper uppercase">
          <Image src={MERCHANT.mark} alt="" width={24} height={24} className="size-6 rounded-md ring-1 ring-white/10" /> CodeXa Agency
        </span>
        <span>Cart · 1</span>
      </div>
      <div className="mt-5 grid grid-cols-[38%_1fr] gap-5">
        <div className="relative aspect-square overflow-hidden rounded-2xl ring-1 ring-white/10">
          <Image src={MERCHANT.product.image} alt="CodeXa Agency" fill sizes="(min-width: 1024px) 260px, 40vw" className="object-cover" />
          <span className="absolute top-2 left-2 rounded-full bg-crimson px-2 py-0.5 font-mono text-[9px] tracking-widest text-white uppercase">Popular</span>
        </div>
        <div>
          <div className="text-[11px] text-muted">{MERCHANT.product.category}</div>
          <div className="font-display text-[15px] font-semibold uppercase sm:text-lg">{MERCHANT.product.title}</div>
          <div className="mt-0.5 text-[11px] text-muted">{MERCHANT.product.subtitle}</div>
          <div className="mt-1 flex items-center gap-0.5 text-warn">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={10} fill="currentColor" />
            ))}
          </div>
          <div className="mt-3 font-display text-xl font-semibold sm:text-2xl">₹499.00</div>
        </div>
      </div>
      <div
        className={`relative mt-6 flex h-12 items-center justify-center gap-2 rounded-full bg-crimson text-[12px] font-semibold tracking-wider text-white uppercase transition-transform duration-200 ${clicked ? "scale-95" : ""}`}
      >
        <ShoppingBag size={14} /> Pay with PayXa
        {clicked && <span className="absolute inset-0 animate-ping rounded-full border-2 border-white/60" />}
      </div>
      {stage === 0 && (
        <MousePointer2
          size={26}
          className="absolute z-10 fill-white text-ink drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] transition-[left,top] duration-150"
          style={{ left: `${cx}%`, top: `${cy}%` }}
        />
      )}
    </div>
  );
}

function CheckoutPanel({ stage }: { stage: number }) {
  const statusIdx = stage <= 3 ? 0 : stage === 4 ? 1 : 3;
  const rows = ["Awaiting payment", "Payment detected", "Verifying", "Verified"];
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.7, ease }}
      style={{ transformPerspective: 1000 }}
      className="absolute inset-x-[6%] top-[6%] bottom-[6%] rounded-2xl border border-white/10 bg-[#0c0b0f] p-5 shadow-[0_30px_100px_-20px_rgba(217,4,41,0.6)]"
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold">CodeXa Agency</span>
        <span className="font-mono text-[10px] text-dim">PXA-20481</span>
      </div>
      <div className="mt-1 font-display text-2xl font-semibold sm:text-3xl">₹499.00</div>
      {stage < 5 ? (
        <div className="mt-4 grid grid-cols-[42%_1fr] items-center gap-5">
          <ScannerFrame locked={stage >= 3}>
            <RealQR />
          </ScannerFrame>
          <ul className="space-y-2.5 text-[12px]">
            {rows.map((r, i) => {
              const done = i < statusIdx || (stage === 4 && i === 1);
              const active = (stage <= 3 && i === 0) || (stage === 4 && i === 2);
              return (
                <li key={r} className="flex items-center gap-2">
                  <span
                    className={`grid size-5 place-items-center rounded-full border ${
                      done ? "border-ok bg-ok/15 text-ok" : active ? "border-neon text-neon" : "border-white/10"
                    }`}
                  >
                    {done ? <Check size={10} /> : active ? <Loader2 size={10} className="animate-spin" /> : null}
                  </span>
                  <span className={done || active ? "text-paper" : "text-dim"}>{r}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center text-center">
          <motion.span
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 14 }}
            className="grid size-16 place-items-center rounded-full bg-ok text-ink shadow-[0_0_60px_rgba(43,214,123,0.6)]"
          >
            <Check size={32} strokeWidth={3} />
          </motion.span>
          <div className="mt-4 font-display text-lg font-semibold uppercase">Payment successful</div>
          <div className="mt-1 font-mono text-[11px] text-ok">PAYMENT_VERIFIED · BANK_PSP</div>
        </div>
      )}
    </motion.div>
  );
}

function CustomerPhone({ p, stage }: { p: number; stage: number }) {
  const pin = Math.min(6, Math.floor(local(p, 3) * 8));
  const sent = stage === 3 && local(p, 3) > 0.85;
  return (
    <motion.div
      initial={{ opacity: 0, y: 160, rotateY: -30, rotateX: 20 }}
      animate={{ opacity: 1, y: 0, rotateY: -12, rotateX: 6 }}
      exit={{ opacity: 0, y: 160, rotateY: -30 }}
      transition={{ duration: 0.8, ease }}
      style={{ transformPerspective: 1200 }}
      className="absolute -right-2 -bottom-6 z-20 w-[150px] sm:-right-6 sm:w-[200px]"
    >
      <PhoneFrame className="!max-w-none">
        <StatusBar />
        {stage === 2 ? (
          <div className="relative flex h-[calc(100%-28px)] flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_40%,#2a2a30,#050505)] px-4">
            <div className="absolute top-3 font-mono text-[8px] tracking-[0.2em] text-white/60 uppercase">Scan any QR</div>
            <ScannerFrame locked={local(p, 2) > 0.8} className="w-[78%]">
              <div className="[filter:blur(0.4px)_contrast(1.1)]" style={{ transform: `perspective(400px) rotateX(${10 - local(p, 2) * 10}deg) scale(${0.9 + local(p, 2) * 0.1})` }}>
                <RealQR />
              </div>
            </ScannerFrame>
            <div className={`mt-5 rounded-full px-3 py-1 text-[9px] font-semibold ${local(p, 2) > 0.8 ? "bg-ok text-ink" : "bg-white/10 text-white/80"}`}>
              {local(p, 2) > 0.8 ? "QR detected · CodeXa Agency" : "Align QR inside the frame"}
            </div>
          </div>
        ) : (
          <div className="flex h-[calc(100%-28px)] flex-col px-4 pt-4">
            <div className="text-[9px] font-semibold tracking-[0.18em] text-muted uppercase">Your UPI app</div>
            <div className="mt-4 text-[10px] text-muted">Paying</div>
            <div className="text-[12px] font-semibold">CodeXa Agency</div>
            <div className="mt-2 font-display text-2xl font-semibold">₹499</div>
            {sent ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-auto mb-10 flex flex-col items-center gap-2">
                <span className="grid size-10 place-items-center rounded-full bg-ok text-ink">
                  <Check size={20} strokeWidth={3} />
                </span>
                <span className="text-[10px] font-semibold">Payment sent</span>
              </motion.div>
            ) : (
              <div className="mt-auto mb-8">
                <div className="text-center text-[9px] text-muted">Enter UPI PIN</div>
                <div className="mt-2 flex justify-center gap-1.5">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className={`size-2.5 rounded-full border border-white/30 transition-colors ${i < pin ? "bg-paper" : ""}`} />
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-1 text-center text-[10px] text-paper/70">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <span key={n} className="rounded bg-white/[0.05] py-1">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </PhoneFrame>
    </motion.div>
  );
}

function MerchantAlerts({ stage, compact = false }: { stage: number; compact?: boolean }) {
  const cards = [
    stage >= 1 && { k: "s", icon: BellRing, title: "Payment Started", sub: "₹499.00 · PXA-20481", tone: "text-neon", ring: "border-crimson/40" },
    stage >= 4 && { k: "d", icon: Radar, title: "Incoming Credit Detected", sub: "₹499.00 · Verifying", tone: "text-warn", ring: "border-warn/40" },
    stage >= 5 && { k: "v", icon: ShieldCheck, title: "Payment Verified", sub: "₹499.00 · Successful", tone: "text-ok", ring: "border-ok/40" },
  ].filter(Boolean) as { k: string; icon: typeof BellRing; title: string; sub: string; tone: string; ring: string }[];
  return (
    <div className={compact ? "space-y-1.5" : "space-y-2.5"}>
      <AnimatePresence initial={false}>
        {[...cards].reverse().map((n) => (
          <motion.div
            key={n.k}
            layout
            initial={{ opacity: 0, y: -30, rotateX: -50, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease }}
            style={{ transformPerspective: 600 }}
            className={`rounded-2xl border ${n.ring} bg-[#141217]/95 backdrop-blur ${compact ? "px-3 py-2" : "p-3"}`}
          >
            {!compact && <div className="text-[9px] text-dim">PayXa · Live Alerts · now</div>}
            <div className={`flex items-center gap-1.5 text-[12px] font-semibold ${n.tone}`}>
              <n.icon size={12} /> {n.title}
            </div>
            <div className="text-[11px] text-paper">{n.sub}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function CheckoutExperience() {
  const wrap = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  const reduce = useReducedMotion();
  const { openCheckout } = useCheckout();
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const frameRot = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [18, 0, 0, -8]);
  const frameScale = useTransform(scrollYProgress, [0, 0.12, 0.9, 1], [0.86, 1, 1, 0.94]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const r = Math.round(v * 400) / 400;
    setP(r);
    if (v > 0 && v < 1) sceneStore.set({ shape: shapes[stageOf(v)], side: "center", lock: Date.now() + 500 });
  });

  const stage = reduce ? 5 : stageOf(p);
  const shown = logLines.filter((l) => l.s <= stage);

  return (
    <section ref={wrap} id="checkout" className={`relative ${reduce ? "py-24" : "h-[640vh]"}`}>
      <div className={`${reduce ? "" : "sticky top-0 h-[100svh]"} flex items-center overflow-x-clip`}>
        <div className="container-px grid w-full grid-cols-1 items-center gap-6 pt-[calc(var(--nav-h)-20px)] lg:grid-cols-[1.25fr_0.75fr] lg:gap-12 [&>*]:min-w-0">
          {/* Stage */}
          <div>
            <div className="mb-4 flex items-end justify-between gap-4 lg:hidden">
              <Caption stage={stage} />
            </div>
            <motion.div style={reduce ? undefined : { rotateX: frameRot, scale: frameScale, transformPerspective: 1600 }} className="relative">
              <div className="absolute -inset-8 -z-10 rounded-full bg-crimson/15 blur-[90px]" />
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink/95 shadow-[0_50px_140px_-30px_rgba(217,4,41,0.55)]">
                <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
                  <span className="size-2.5 rounded-full bg-crimson" />
                  <span className="size-2.5 rounded-full bg-white/15" />
                  <span className="size-2.5 rounded-full bg-white/15" />
                  <span className="ml-3 flex-1 truncate rounded-md bg-white/[0.04] px-3 py-1 font-mono text-[10px] text-dim">
                    https://codexa-agency.online/{stage === 0 ? "cart" : "checkout"}
                  </span>
                  <span className="hidden rounded-full border border-warn/30 px-2 py-0.5 font-mono text-[9px] text-warn sm:inline">TEST MODE</span>
                </div>
                <div className="relative aspect-[4/3.3] sm:aspect-[16/10.5]">
                  <div className={`absolute inset-0 transition-all duration-700 ${stage >= 1 ? "scale-95 opacity-25 blur-[2px]" : ""}`}>
                    <Store p={p} stage={stage} />
                  </div>
                  <AnimatePresence>{stage >= 1 && <CheckoutPanel key="ck" stage={stage} />}</AnimatePresence>
                  {/* mobile merchant toasts */}
                  <div className="absolute top-3 right-3 left-3 z-30 lg:hidden">
                    <MerchantAlerts stage={stage} compact />
                  </div>
                </div>
              </div>
              <AnimatePresence>{(stage === 2 || stage === 3) && <CustomerPhone key="cp" p={p} stage={stage} />}</AnimatePresence>
            </motion.div>
            <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full origin-left bg-gradient-to-r from-crimson to-hot shadow-[0_0_10px_#ff4265]" style={{ transform: `scaleX(${p})` }} />
            </div>
          </div>

          {/* Narrative + merchant side (desktop) */}
          <div className="hidden lg:block">
            <div className="eyebrow flex items-center gap-3">
              <span className="text-neon">03</span>
              <span className="h-px w-8 bg-crimson/70" />
              Live checkout · scroll to pay
            </div>
            <h2 className="display mt-4 text-[clamp(30px,3.6vw,52px)]">
              One payment,
              <br />
              <span className="text-gradient-red">end to end.</span>
            </h2>
            <ol className="mt-6 space-y-1">
              {captions.map((c, i) => (
                <li key={c.t} className={`flex gap-3 rounded-xl px-3 py-2 transition-all duration-500 ${i === stage ? "bg-white/[0.04]" : "opacity-40"}`}>
                  <span className={`mt-0.5 font-mono text-[11px] ${i <= stage ? "text-neon" : "text-dim"}`}>0{i + 1}</span>
                  <div>
                    <div className="text-[14px] font-semibold">{c.t}</div>
                    <AnimatePresence initial={false}>
                      {i === stage && (
                        <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden text-[13px] text-muted">
                          {c.d}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-5 grid grid-cols-[1fr_1fr] gap-3">
              <div>
                <div className="mb-2 font-mono text-[10px] tracking-[0.18em] text-dim uppercase">Merchant phone</div>
                <MerchantAlerts stage={stage} />
              </div>
              <div className="card h-[208px] overflow-hidden p-3 font-mono text-[10px] leading-relaxed">
                <div className="mb-1 tracking-[0.18em] text-dim uppercase">Events</div>
                {shown.map((l) => (
                  <motion.div key={l.text} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className={`${l.tone} break-words`}>
                    {l.text}
                  </motion.div>
                ))}
              </div>
            </div>
            <button onClick={() => openCheckout()} className="btn btn-ghost btn-sm mt-5">
              <Play size={13} /> Try it yourself
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Caption({ stage }: { stage: number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={stage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
        <div className="font-mono text-[10px] text-neon">STEP 0{stage + 1} / 06</div>
        <div className="mt-1 font-display text-lg font-semibold uppercase">{captions[stage].t}</div>
        <p className="text-[13px] text-muted">{captions[stage].d}</p>
      </motion.div>
    </AnimatePresence>
  );
}

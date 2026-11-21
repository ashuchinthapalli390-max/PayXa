"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, BellRing, CheckCircle2, Radar, ShoppingBag } from "lucide-react";
import { SplitReveal } from "@/components/fx/Reveal";
import { useCheckout } from "@/components/checkout/CheckoutProvider";
import { useIntroDone } from "@/components/fx/IntroLoader";
import { Magnetic, Scramble } from "@/components/fx/Interactive";

const events = [
  { icon: BellRing, label: "Checkout started", meta: "PXA-20481 · ₹499.00", tone: "text-neon", dot: "bg-neon" },
  { icon: Radar, label: "UPI credit detected", meta: "Matching to order…", tone: "text-warn", dot: "bg-warn" },
  { icon: CheckCircle2, label: "Payment verified", meta: "Trusted source · ₹499.00", tone: "text-ok", dot: "bg-ok" },
];

const ease = [0.16, 1, 0.3, 1] as const;

function EventCards() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setStep((s) => (s + 1) % 4), 1800);
    return () => window.clearInterval(id);
  }, []);
  const positions = [
    "left-[2%] top-[18%]",
    "right-[0%] top-[44%]",
    "left-[10%] bottom-[14%]",
  ];
  return (
    <>
      {events.map((e, i) => (
        <AnimatePresence key={e.label}>
          {step > i && (
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.94, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, scale: 0.96, filter: "blur(4px)" }}
              transition={{ duration: 0.6, ease }}
              className={`glass absolute ${positions[i]} z-10 hidden w-[230px] rounded-2xl p-3.5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] sm:block`}
            >
              <div className="flex items-center gap-3">
                <span className={`grid size-9 place-items-center rounded-xl bg-white/[0.04] ${e.tone}`}>
                  <e.icon size={17} />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[13px] font-semibold text-paper">
                    <span className={`size-1.5 rounded-full ${e.dot}`} />
                    {e.label}
                  </div>
                  <div className="truncate font-mono text-[11px] text-muted">{e.meta}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { openCheckout } = useCheckout();
  const ready = useIntroDone();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const contentRot = useTransform(scrollYProgress, [0, 1], [0, 22]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  return (
    <section
      ref={ref}
      data-scene="qr"
      data-side="right"
      className="noise relative isolate flex min-h-[100svh] items-center overflow-hidden pt-[var(--nav-h)]"
    >
      {/* Background layers */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_70%_40%,rgba(100,10,30,0.23),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgba(217,4,41,0.06),transparent_50%)]" />
      <motion.div style={{ y: gridY }} className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[46%] overflow-hidden">
        <div className="floor-grid" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon to-transparent opacity-70 shadow-[0_0_30px_6px_rgba(255,66,101,0.25)]" />
      </motion.div>

      <div className="pointer-events-none absolute top-0 right-0 bottom-0 left-[50%] -z-10 hidden lg:block">
        <EventCards />
      </div>

      {/* Corner micro labels */}
      <div className="pointer-events-none absolute top-[calc(var(--nav-h)+20px)] right-4 hidden font-mono text-[10px] leading-relaxed tracking-[0.2em] text-dim uppercase md:block lg:right-10">
        <Scramble text="NODE // UPI-NET-01" />
        <br />
        <span className="text-neon">● </span>NETWORK ONLINE
      </div>
      <div className="pointer-events-none absolute bottom-8 left-4 hidden font-mono text-[10px] tracking-[0.2em] text-dim uppercase md:block lg:left-10">
        17.3850° N · 78.4867° E
      </div>

      <motion.div
        style={{ y: contentY, rotateX: contentRot, opacity: contentOpacity, transformPerspective: 1200, transformOrigin: "50% 0%" }}
        className="container-px relative py-16"
      >
        <div className="max-w-[720px]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, ease, delay: 0.5 }}
            className="chip mb-8 border-crimson/40 !text-paper"
          >
            <span className="pulse-dot" />
            UPI Checkout · Instant Alerts · Developer APIs
          </motion.div>

          <SplitReveal
            as="h1"
            immediate
            hold={!ready}
            delay={0.55}
            text={"Payments.\nWithout the wait."}
            className="display text-[clamp(42px,7.2vw,100px)]"
            accentFrom={1}
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, ease, delay: 1.05 }}
            className="mt-8 max-w-[540px] text-[17px] leading-relaxed text-muted sm:text-lg"
          >
            UPI-first checkout with instant merchant alerts, live payment tracking, developer-friendly integrations and
            trusted verification. <span className="text-paper">₹0 PayXa platform fee.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, ease, delay: 1.2 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <Link href="/register" className="btn btn-primary h-14 px-8">
                Start with PayXa <ArrowRight size={16} />
              </Link>
            </Magnetic>
            <Magnetic>
              <button type="button" onClick={() => openCheckout()} className="btn btn-ghost h-14 px-8">
                <ShoppingBag size={16} /> Try checkout
              </button>
            </Magnetic>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : undefined}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-12 grid max-w-[560px] grid-cols-3 gap-6 border-t border-white/[0.08] pt-6"
          >
            {[
              ["₹0", "Platform fee"],
              ["< 1s", "Verified update target"],
              ["0", "Customer apps to install"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-display text-xl font-semibold text-paper sm:text-2xl">{v}</dt>
                <dd className="mt-1 font-mono text-[10px] tracking-[0.16em] text-dim uppercase">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </motion.div>

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="font-mono text-[10px] tracking-[0.3em] text-dim uppercase">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <span className="absolute inset-x-0 h-1/2 bg-neon [animation:scan_1.8s_ease-in-out_infinite]" />
        </span>
      </div>
    </section>
  );
}

"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Marquee } from "@/components/fx/Interactive";

const words = ["UPI Checkout", "Instant Alerts", "Payment Links", "QR Payments", "Webhooks", "Reconciliation", "Developer APIs", "Merchant App"];

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="mx-6 size-4 shrink-0" aria-hidden>
      <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" fill="currentColor" />
    </svg>
  );
}

/**
 * Two crossing tapes. Each tape is fully opaque and the dark one sits on top,
 * so the text never shows through where they cross. Scroll pushes them apart.
 */
export default function TickerBand() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const xA = useTransform(scrollYProgress, [0, 1], ["4%", "-10%"]);
  const xB = useTransform(scrollYProgress, [0, 1], ["-6%", "8%"]);
  const rotA = useTransform(scrollYProgress, [0, 1], [-4, -1.5]);
  const rotB = useTransform(scrollYProgress, [0, 1], [3.5, 1.5]);

  return (
    <section ref={ref} aria-label="PayXa capabilities" className="relative z-10 overflow-hidden py-20">
      <motion.div
        style={{ rotate: rotA, x: xA }}
        className="relative z-10 -mx-[10%] w-[120%] border-y border-neon/50 bg-crimson py-4 text-white shadow-[0_0_60px_-10px_rgba(217,4,41,0.4)]"
      >
        <Marquee duration={36}>
          {words.map((w) => (
            <span key={w} className="flex items-center font-display text-lg font-bold tracking-tight uppercase sm:text-2xl">
              {w}
              <Star />
            </span>
          ))}
        </Marquee>
      </motion.div>
      <motion.div
        style={{ rotate: rotB, x: xB }}
        className="absolute inset-x-0 top-1/2 z-20 -mx-[10%] w-[120%] -translate-y-1/2 border-y border-white/15 bg-[#0b0a0d] py-3 text-muted shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9),0_-20px_50px_-10px_rgba(0,0,0,0.9)]"
      >
        <Marquee duration={50} reverse>
          {words.map((w) => (
            <span key={w} className="flex items-center font-mono text-xs tracking-[0.3em] uppercase">
              {w}
              <span className="mx-6 text-neon">✦</span>
            </span>
          ))}
        </Marquee>
      </motion.div>
    </section>
  );
}

"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";

/**
 * Pinned (sticky) section: the PAYXA wordmark scales up until the camera
 * flies through the crimson X, then the screen floods red and clears.
 */
export default function ZoomStatement() {
  const wrap = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const x = useRef<HTMLSpanElement>(null);
  const [origin, setOrigin] = useState("68% 52%");
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    const measure = () => {
      if (!word.current || !x.current) return;
      const w = word.current.getBoundingClientRect();
      const r = x.current.getBoundingClientRect();
      const ox = ((r.left + r.width / 2 - w.left) / w.width) * 100;
      const oy = ((r.top + r.height * 0.52 - w.top) / w.height) * 100;
      setOrigin(`${ox}% ${oy}%`);
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress: p } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const scale = useTransform(p, [0.18, 0.8], [1, 46]);
  const lineOpacity = useTransform(p, [0, 0.08, 0.2, 0.3], [0, 1, 1, 0]);
  const lineY = useTransform(p, [0, 0.1], [40, 0]);
  const wordOpacity = useTransform(p, [0.02, 0.1], [0, 1]);
  const flood = useTransform(p, [0.62, 0.78, 0.94, 1], [0, 1, 1, 0]);
  const finalOpacity = useTransform(p, [0.8, 0.88, 0.94, 1], [0, 1, 1, 0]);
  const finalY = useTransform(p, [0.8, 0.9], [30, 0]);

  if (reduce) {
    return (
      <section ref={wrap} className="section-y text-center" data-scene="tunnel" data-side="center">
        <div className="display text-[16vw]">
          PAY<span className="text-crimson">X</span>A
        </div>
        <p className="mt-6 font-mono text-[12px] tracking-[0.3em] text-muted uppercase">One script · Every UPI app · Every alert</p>
      </section>
    );
  }

  return (
    <section ref={wrap} className="relative h-[340vh]" data-scene="tunnel" data-side="center" aria-label="One script, every UPI app">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <motion.p
          style={{ opacity: lineOpacity, y: lineY }}
          className="absolute top-[22%] w-full px-4 text-center font-mono text-[11px] tracking-[0.35em] text-muted uppercase sm:text-[13px]"
        >
          One script · Every UPI app · Every alert
        </motion.p>
        <motion.div
          ref={word}
          style={{ scale, opacity: wordOpacity, transformOrigin: origin }}
          className="display text-[clamp(72px,19vw,300px)] leading-none will-change-transform"
        >
          PAY
          <span ref={x} className="inline-block text-crimson [text-shadow:0_0_30px_rgba(255,66,101,0.2)]">
            X
          </span>
          A
        </motion.div>
        <motion.div style={{ opacity: flood }} className="pointer-events-none absolute inset-0 bg-[#8c0a1f]" />
        <motion.div style={{ opacity: finalOpacity, y: finalY }} className="absolute inset-x-0 px-4 text-center">
          <div className="display text-[clamp(34px,6vw,84px)] text-white">
            Checkout to <span className="text-ink">verified</span>
          </div>
          <div className="display text-[clamp(34px,6vw,84px)] text-white/90">in one flow.</div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/fx/Interactive";
import { OrbitFallback } from "@/components/three/GlobeStage";

const lines = ["Start accepting", "UPI payments", "with PayXa."];

/** Cinematic close: the crimson card expands to fill the screen as you scroll, then the words rise in. */
export default function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end end"] });
  // function form keeps this on the JS path (string clip-paths + sticky don't accelerate reliably)
  const clip = useTransform(p, (v) => {
    const k = 1 - Math.min(1, Math.max(0, v / 0.55));
    return `inset(${16 * k}% ${12 * k}% ${16 * k}% ${12 * k}% round ${40 * k}px)`;
  });
  const bgScale = useTransform(p, [0, 0.6], [1.25, 1]);
  const orbitRot = useTransform(p, [0, 1], [0, 140]);
  const l0 = useTransform(p, [0.35, 0.55], [120, 0]);
  const l1 = useTransform(p, [0.42, 0.62], [120, 0]);
  const l2 = useTransform(p, [0.49, 0.69], [120, 0]);
  const ys = [l0, l1, l2];
  const rest = useTransform(p, [0.62, 0.8], [0, 1]);
  const restY = useTransform(p, [0.62, 0.8], [30, 0]);

  return (
    <section ref={ref} className={`relative ${reduce ? "" : "h-[210vh]"}`} data-scene="check" data-side="center">
      <div className={`${reduce ? "" : "sticky top-0"} h-[100svh] overflow-hidden`}>
        <motion.div
          style={reduce ? undefined : { clipPath: clip }}
          className="noise absolute inset-0 grid place-items-center overflow-hidden bg-gradient-to-br from-crimson/95 via-[#a3031f]/90 to-crimson-deep/95"
        >
          <motion.div style={reduce ? undefined : { scale: bgScale }} className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            <motion.div style={reduce ? undefined : { rotate: orbitRot }} className="absolute -right-40 -bottom-40 size-[620px] opacity-40 mix-blend-screen">
              <OrbitFallback className="size-full" />
            </motion.div>
            <motion.div style={reduce ? undefined : { rotate: orbitRot }} className="absolute -top-48 -left-48 size-[520px] opacity-25 mix-blend-screen">
              <OrbitFallback className="size-full" />
            </motion.div>
          </motion.div>

          <div className="relative px-4 text-center">
            <motion.span style={reduce ? undefined : { opacity: rest }} className="font-mono text-[11px] tracking-[0.3em] text-white/70 uppercase">
              Get started
            </motion.span>
            <h2 className="display mx-auto mt-6 max-w-5xl text-[clamp(36px,7.4vw,112px)] text-white" aria-label={lines.join(" ")}>
              {lines.map((l, i) => (
                <span key={l} className="block overflow-hidden pb-[0.06em]" aria-hidden>
                  <motion.span style={reduce ? undefined : { y: ys[i] }} className={`block ${i === 2 ? "text-ink/90" : ""}`}>
                    {l}
                  </motion.span>
                </span>
              ))}
            </h2>
            <motion.div style={reduce ? undefined : { opacity: rest, y: restY }}>
              <p className="mx-auto mt-6 max-w-xl text-[16px] text-white/85">
                Join the sandbox today. Build your integration while we complete partner and compliance reviews for live payments.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Magnetic>
                  <Link href="/register" className="btn h-14 bg-white px-9 text-ink shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] hover:bg-paper">
                    Create free account <ArrowRight size={16} />
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link href="/contact" className="btn h-14 border border-white/40 px-9 text-white hover:bg-white/10">
                    Talk to us
                  </Link>
                </Magnetic>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

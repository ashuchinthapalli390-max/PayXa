"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BellRing, Radar, ShieldCheck, TrendingUp } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const alerts = [
  { icon: BellRing, title: "Payment Started", sub: "₹499.00 · PXA-20481", tone: "text-neon", ring: "border-crimson/40" },
  { icon: Radar, title: "Credit Detected", sub: "₹1,299.00 · Verifying", tone: "text-warn", ring: "border-warn/40" },
  { icon: ShieldCheck, title: "Payment Verified", sub: "₹799.00 · Successful", tone: "text-ok", ring: "border-ok/40" },
];

const spark = [12, 18, 15, 24, 20, 31, 27, 36, 33, 44, 40, 52];

/** Right-hand showcase on the auth screens: floating workspace preview in 3D. */
export default function AuthVisual() {
  const [n, setN] = useState(1);
  const [vol, setVol] = useState(24950);
  useEffect(() => {
    const id = window.setInterval(() => {
      setN((v) => (v % 3) + 1);
      setVol((v) => (v > 32000 ? 24950 : v + [499, 1299, 799][Math.floor(Math.random() * 3)]));
    }, 2200);
    return () => window.clearInterval(id);
  }, []);
  const max = Math.max(...spark);
  const pts = spark.map((v, i) => `${(i / (spark.length - 1)) * 100},${40 - (v / max) * 36}`).join(" ");

  return (
    <div className="relative mx-auto w-full max-w-[460px] [perspective:1400px]">
      <motion.div
        initial={{ opacity: 0, rotateY: -18, rotateX: 10, y: 40 }}
        animate={{ opacity: 1, rotateY: -10, rotateX: 6, y: 0 }}
        transition={{ duration: 1.2, ease, delay: 0.3 }}
        className="glass relative rounded-[28px] p-6 shadow-[0_60px_140px_-40px_rgba(217,4,41,0.6)]"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">Verified today</span>
          <span className="flex items-center gap-1 rounded-full bg-ok/10 px-2 py-0.5 font-mono text-[10px] text-ok">
            <TrendingUp size={11} /> +18%
          </span>
        </div>
        <motion.div key={vol} initial={{ opacity: 0.4, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-2 font-display text-4xl font-semibold tabular-nums">
          ₹{vol.toLocaleString("en-IN")}
        </motion.div>
        <svg viewBox="0 0 100 42" className="mt-4 h-20 w-full" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="av" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ff4265" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ff4265" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`0,42 ${pts} 100,42`} fill="url(#av)" />
          <polyline points={pts} fill="none" stroke="#ff4265" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="mt-5 space-y-2.5">
          <AnimatePresence initial={false}>
            {alerts.slice(0, n).map((a) => (
              <motion.div
                key={a.title}
                layout
                initial={{ opacity: 0, x: 40, rotateY: -25 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease }}
                className={`flex items-center gap-3 rounded-2xl border ${a.ring} bg-[#141217]/90 px-4 py-3`}
              >
                <a.icon size={16} className={a.tone} />
                <div className="flex-1">
                  <div className={`text-[13px] font-semibold ${a.tone}`}>{a.title}</div>
                  <div className="text-[12px] text-muted">{a.sub}</div>
                </div>
                <span className="font-mono text-[10px] text-dim">now</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease, delay: 0.7 }}
        className="glass absolute -bottom-10 -left-10 hidden rounded-2xl px-4 py-3 xl:block"
      >
        <div className="font-mono text-[10px] tracking-[0.18em] text-dim uppercase">Devices</div>
        <div className="mt-1 flex items-center gap-2 text-[13px]">
          <span className="size-2 rounded-full bg-ok shadow-[0_0_10px_#2bd67b]" /> 2 phones online
        </div>
      </motion.div>
    </div>
  );
}

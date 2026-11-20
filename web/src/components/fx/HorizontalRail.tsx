"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

function RailCard({ children, i, n, progress }: { children: ReactNode; i: number; n: number; progress: MotionValue<number> }) {
  const center = n > 1 ? i / (n - 1) : 0.5;
  // Function transforms (not keyframe offsets) because the ranges extend past 0..1.
  const d = (v: number) => v - center;
  const rotateY = useTransform(progress, (v) => Math.max(-28, Math.min(28, d(v) * 56)));
  const z = useTransform(progress, (v) => -Math.min(160, Math.abs(d(v)) * 400));
  const opacity = useTransform(progress, (v) => {
    const a = Math.abs(d(v));
    return a <= 0.2 ? 1 : Math.max(0.35, 1 - ((a - 0.2) / 0.4) * 0.65);
  });
  return (
    <motion.div style={{ rotateY, z, opacity, transformPerspective: 1400 }} className="w-[min(420px,80vw)] shrink-0">
      {children}
    </motion.div>
  );
}

function DesktopRail({ items, header }: { items: ReactNode[]; header?: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  useLayoutEffect(() => {
    const measure = () => track.current && setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items.length]);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);

  return (
    <div ref={wrap} style={{ height: `calc(100svh + ${dist}px)` }} className="relative">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="container-px">{header}</div>
        <motion.div ref={track} style={{ x }} className="mt-12 flex w-max gap-6 pr-[10vw] pl-[max(40px,calc((100vw-1280px)/2+40px))]">
          {items.map((it, i) => (
            <RailCard key={i} i={i} n={items.length} progress={scrollYProgress}>
              {it}
            </RailCard>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Vertical scroll drives a horizontal 3D carousel on desktop (sticky, no scroll hijacking).
 * On small screens it falls back to a normal grid.
 */
export default function HorizontalRail({ items, header }: { items: ReactNode[]; header?: ReactNode }) {
  const [desktop, setDesktop] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  if (desktop && !reduce) return <DesktopRail items={items} header={header} />;
  return (
    <div className="container-px">
      {header}
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {items.map((it, i) => (
          <div key={i}>{it}</div>
        ))}
      </div>
    </div>
  );
}

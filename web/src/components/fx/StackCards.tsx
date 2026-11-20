"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";

function Card({
  children,
  i,
  n,
  progress,
  top,
}: {
  children: ReactNode;
  i: number;
  n: number;
  progress: MotionValue<number>;
  top: number;
}) {
  const start = i / n;
  const scale = useTransform(progress, [start, 1], [1, 1 - (n - 1 - i) * 0.05]);
  const rotateX = useTransform(progress, [start, Math.min(1, start + 1 / n)], [0, i === n - 1 ? 0 : -8]);
  const brightness = useTransform(progress, [start, 1], [1, 1 - (n - 1 - i) * 0.18]);
  const filter = useTransform(brightness, (b) => `brightness(${b})`);
  return (
    <div className="sticky h-[78vh] last:h-auto" style={{ top: `calc(var(--nav-h) + ${top + i * 26}px)` }}>
      <motion.div style={{ scale, rotateX, filter, transformPerspective: 1200, transformOrigin: "50% 0%" }}>{children}</motion.div>
    </div>
  );
}

/** Sticky cards that stack and recede in 3D as you scroll. */
export default function StackCards({ items, top = 32 }: { items: ReactNode[]; top?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  if (reduce)
    return (
      <div ref={ref} className="space-y-4">
        {items.map((it, i) => (
          <div key={i}>{it}</div>
        ))}
      </div>
    );
  return (
    <div ref={ref} className="relative">
      {items.map((it, i) => (
        <Card key={i} i={i} n={items.length} progress={scrollYProgress} top={top}>
          {it}
        </Card>
      ))}
    </div>
  );
}

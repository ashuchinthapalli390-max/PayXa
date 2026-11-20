"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Shape, Side } from "./sceneStore";

/**
 * Marks a region that morphs the global 3D universe into `shape`.
 * With `cinematic`, the region also opens like a lens as it scrolls in
 * (only use it on regions without sticky/pinned children).
 */
export default function Scene({
  shape,
  side = "center",
  cinematic = false,
  children,
}: {
  shape: Shape;
  side?: Side;
  cinematic?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "start 0.3"] });
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const clipPath = useTransform(p, (v) => {
    const k = 1 - clamp(v);
    return `inset(${7 * k}% ${5 * k}% 0% ${5 * k}% round ${36 * k}px)`;
  });
  const scale = useTransform(p, (v) => 0.93 + 0.07 * clamp(v));
  const filter = useTransform(p, (v) => `brightness(${0.55 + 0.45 * clamp(v)})`);

  if (!cinematic || reduce)
    return (
      <div ref={ref} data-scene={shape} data-side={side}>
        {children}
      </div>
    );
  return (
    <motion.div ref={ref} data-scene={shape} data-side={side} style={{ clipPath, scale, filter, transformOrigin: "50% 0%" }}>
      {children}
    </motion.div>
  );
}

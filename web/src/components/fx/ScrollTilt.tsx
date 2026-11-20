"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Scroll-scrubbed 3D: the block tilts back in from below, sits flat while
 * centred, then tilts away as it leaves the viewport.
 */
export default function ScrollTilt({
  children,
  className = "",
  strength = 1,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const rotateX = useTransform(p, [0, 0.35, 0.65, 1], [28 * strength, 0, 0, 12 * strength]);
  const scale = useTransform(p, [0, 0.35, 0.65, 1], [1 - 0.14 * strength, 1, 1, 1 - 0.06 * strength]);
  const y = useTransform(p, [0, 0.35], [90 * strength, 0]);
  const opacity = useTransform(p, [0, 0.22, 0.85, 1], [0, 1, 1, 0.35]);

  if (reduce)
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, scale, y, opacity, transformPerspective: 1400, transformOrigin: "50% 100%" }}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode, type ElementType } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

/** Fade + rise when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "span";
}) {
  const reduce = useReducedMotion();
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y: y * 1.6, rotateX: 24, z: -120 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, z: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, ease, delay }}
      style={{ transformPerspective: 1200, transformOrigin: "50% 100%" }}
    >
      {children}
    </M>
  );
}

/** Word-by-word masked slide-up heading reveal. */
export function SplitReveal({
  text,
  className,
  as: Tag = "h2",
  delay = 0,
  stagger = 0.06,
  accentWords = [],
  accentFrom,
  immediate = false,
}: {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  stagger?: number;
  /** words (case-insensitive, punctuation ignored) rendered with the red gradient */
  accentWords?: string[];
  /** every word from this index on gets the red gradient */
  accentFrom?: number;
  immediate?: boolean;
}) {
  const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9₹]/g, "");
  const accents = accentWords.map(norm);
  const wordClass = (w: string, i: number) =>
    (accentFrom !== undefined && i >= accentFrom) || accents.includes(norm(w)) ? "text-gradient-red" : undefined;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const show = immediate || inView;
  const lines = text.split("\n");
  let i = 0;
  return (
    <Tag ref={ref} className={className} aria-label={text.replace(/\n/g, " ")}>
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden>
          {line.split(" ").map((word) => {
            const idx = i++;
            return (
              <span key={idx} className="inline-block overflow-hidden pb-[0.08em] align-bottom [perspective:600px]">
                <motion.span
                  className={`inline-block origin-bottom ${wordClass(word, idx) ?? ""}`}
                  initial={reduce ? false : { y: "110%", rotateX: -85 }}
                  animate={show ? { y: "0%", rotateX: 0 } : undefined}
                  transition={{ duration: 1, ease, delay: delay + idx * stagger }}
                >
                  {word}
                  {" "}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

/** Clip-path wipe reveal for panels/visuals. */
export function WipeReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}) {
  const reduce = useReducedMotion();
  const from =
    direction === "up"
      ? "inset(100% 0% 0% 0% round 20px)"
      : direction === "left"
        ? "inset(0% 100% 0% 0% round 20px)"
        : "inset(0% 0% 0% 100% round 20px)";
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { clipPath: from, opacity: 0.4 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 20px)", opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

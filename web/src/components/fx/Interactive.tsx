"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as RPointerEvent,
  type HTMLAttributes,
} from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/** Card with a pointer-following crimson border light. */
export function SpotlightCard({
  children,
  className = "",
  ...rest
}: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) {
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div onPointerMove={onMove} className={`card spotlight ${className}`} {...rest}>
      {children}
    </div>
  );
}

/** Pulls its child slightly toward the pointer. */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const onMove = (e: RPointerEvent<HTMLSpanElement>) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };
  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
    >
      {children}
    </span>
  );
}

/** Number that counts up when visible. */
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.8,
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: setVal });
    return () => c.stop();
  }, [inView, to, duration, reduce]);
  return (
    <span ref={ref} className={className}>
      {prefix}
      {val.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/** Infinite horizontal ticker. */
export function Marquee({
  children,
  duration = 40,
  reverse = false,
  className = "",
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex overflow-hidden ${className}`}>
      <div
        className="animate-marquee flex shrink-0 items-center"
        style={{
          ["--marquee-dur" as string]: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Text that scrambles into place, techy micro-label effect. */
export function Scramble({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!inView || reduce) return;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/_-";
    let frame = 0;
    const total = 22;
    const id = window.setInterval(() => {
      frame++;
      setOut(
        text
          .split("")
          .map((c, i) =>
            c === " " || i < (frame / total) * text.length ? c : chars[Math.floor(Math.random() * chars.length)],
          )
          .join(""),
      );
      if (frame >= total) {
        window.clearInterval(id);
        setOut(text);
      }
    }, 40);
    return () => window.clearInterval(id);
  }, [inView, text, reduce]);
  return (
    <span ref={ref} className={className}>
      {out}
    </span>
  );
}

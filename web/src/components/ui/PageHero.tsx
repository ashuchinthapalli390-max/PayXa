"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal, SplitReveal } from "@/components/fx/Reveal";
import type { Shape, Side } from "@/components/three/sceneStore";

export default function PageHero({
  eyebrow,
  title,
  accentWords = [],
  description,
  children,
  scene = "rings",
  side = "right",
}: {
  eyebrow: string;
  title: string;
  accentWords?: string[];
  description?: ReactNode;
  children?: ReactNode;
  scene?: Shape;
  side?: Side;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 24]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      data-scene={scene}
      data-side={side}
      className="noise relative flex min-h-[86svh] items-center overflow-hidden pt-[calc(var(--nav-h)+48px)] pb-20 lg:pb-28"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_30%,rgba(100,10,30,0.4),transparent_55%)]" />
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-30 [mask-image:radial-gradient(ellipse_at_30%_40%,black,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[38%] overflow-hidden opacity-70">
        <div className="floor-grid" />
      </div>
      <motion.div style={{ y, rotateX, opacity, transformPerspective: 1200, transformOrigin: "50% 0%" }} className="container-px w-full">
        <Reveal>
          <div className="eyebrow flex items-center gap-3">
            <span className="pulse-dot" />
            {eyebrow}
          </div>
        </Reveal>
        <SplitReveal
          as="h1"
          immediate
          delay={0.35}
          text={title}
          accentWords={accentWords}
          className="display mt-6 max-w-5xl text-[clamp(38px,6.6vw,92px)]"
        />
        {description && (
          <Reveal delay={0.5}>
            <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-muted sm:text-lg">{description}</p>
          </Reveal>
        )}
        {children && <Reveal delay={0.6}>{children}</Reveal>}
      </motion.div>
    </section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-3xl space-y-5 text-[16px] leading-relaxed text-muted [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-paper [&_h2]:uppercase [&_h3]:mt-8 [&_h3]:font-semibold [&_h3]:text-paper [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-paper [&_ul]:space-y-2">
      {children}
    </div>
  );
}

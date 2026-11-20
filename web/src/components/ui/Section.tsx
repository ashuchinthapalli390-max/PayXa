import type { ReactNode } from "react";
import { Reveal, SplitReveal } from "@/components/fx/Reveal";

export function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  align = "left",
  accentWords = [],
  children,
}: {
  index?: string;
  eyebrow: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
  accentWords?: string[];
  children?: ReactNode;
}) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      <Reveal>
        <div className={`eyebrow flex items-center gap-3 ${center ? "justify-center" : ""}`}>
          {index && <span className="text-neon">{index}</span>}
          <span className="h-px w-8 bg-crimson/70" />
          {eyebrow}
        </div>
      </Reveal>
      <SplitReveal
        text={title}
        className="display mt-6 text-[clamp(32px,5.2vw,68px)]"
        accentWords={accentWords}
      />
      {description && (
        <Reveal delay={0.15}>
          <p className={`mt-6 text-[17px] leading-relaxed text-muted ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
            {description}
          </p>
        </Reveal>
      )}
      {children}
    </div>
  );
}

export function SandboxBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-warn/40 bg-warn/10 px-3 py-1 font-mono text-[10px] font-semibold tracking-[0.18em] text-warn uppercase ${className}`}
    >
      <span className="size-1.5 rounded-full bg-warn" /> Test mode
    </span>
  );
}

export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative mx-auto aspect-[9/19] w-full max-w-[300px] rounded-[44px] border border-white/10 bg-gradient-to-b from-[#1c1a20] to-[#0b0a0d] p-[10px] shadow-[0_40px_120px_-30px_rgba(217,4,41,0.45),inset_0_0_0_1px_rgba(255,255,255,0.04)] ${className}`}
    >
      <div className="absolute top-[18%] -left-[3px] h-12 w-[3px] rounded-l bg-white/10" />
      <div className="absolute top-[28%] -left-[3px] h-16 w-[3px] rounded-l bg-white/10" />
      <div className="absolute top-[22%] -right-[3px] h-20 w-[3px] rounded-r bg-white/10" />
      <div className="relative h-full w-full overflow-hidden rounded-[36px] bg-[#060507]">
        <div className="absolute top-2.5 left-1/2 z-30 h-[22px] w-[22px] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/5" />
        {children}
      </div>
    </div>
  );
}

export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 font-mono text-[10px] text-paper/80">
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <span className="h-2 w-3 rounded-[2px] border border-paper/60" />
        5G
      </span>
    </div>
  );
}

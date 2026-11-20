import type { ReactNode } from "react";
import { Reveal } from "@/components/fx/Reveal";

export default function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="relative min-h-[100svh] overflow-hidden pt-[var(--nav-h)]" data-scene="card" data-side="left">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_50%,rgba(100,10,30,0.5),transparent_60%)]" />
      <div className="container-px grid min-h-[calc(100svh-var(--nav-h))] items-center gap-12 py-16 lg:grid-cols-2">
        <div className="relative hidden h-full min-h-[520px] overflow-hidden rounded-[24px] border border-white/[0.06] lg:grid lg:place-items-center">
          <div className="grid-bg absolute inset-0 opacity-30" />
          <div className="floor-grid !h-[45%]" />
          <p className="absolute bottom-8 left-8 font-mono text-[11px] tracking-[0.2em] text-dim uppercase">Payments. Connected.</p>
        </div>
        <Reveal>
          <div className="mx-auto w-full max-w-md">
            <h1 className="display text-4xl sm:text-5xl">{title}</h1>
            <p className="mt-3 text-[15px] text-muted">{subtitle}</p>
            <div className="mt-10">{children}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

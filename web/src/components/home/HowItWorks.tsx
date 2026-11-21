"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BadgeCheck, BellRing, Code2, Landmark, QrCode, UserPlus } from "lucide-react";
import { SectionHeader } from "@/components/ui/Section";

gsap.registerPlugin(ScrollTrigger);

export const steps = [
  { icon: UserPlus, title: "Create account", body: "Sign up, verify your email and add your business details." },
  { icon: Landmark, title: "Connect receiving UPI", body: "Add your receiving UPI ID. Ownership is checked before you go live." },
  { icon: QrCode, title: "Pair Android app", body: "Scan a secure dashboard QR with PayXa Merchant to pair your phone." },
  { icon: Code2, title: "Integrate checkout", body: "Use payment links, the hosted checkout, or the API and script." },
  { icon: BellRing, title: "Receive alerts", body: "Every new checkout pushes a Payment Started alert to your devices." },
  { icon: BadgeCheck, title: "Verify payments", body: "Detected credits are matched, then verified against a trusted source." },
];

export default function HowItWorks() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth + 80;
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.8,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
            const cards = el.querySelectorAll<HTMLElement>("[data-step]");
            const active = Math.min(cards.length - 1, Math.floor(self.progress * cards.length * 0.999));
            cards.forEach((c, i) => c.toggleAttribute("data-active", i <= active));
          },
        },
      });
      return () => tween.scrollTrigger?.kill();
    });
    mm.add("(max-width: 1023px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-step]", track.current);
      cards.forEach((c) =>
        ScrollTrigger.create({
          trigger: c,
          start: "top 70%",
          onEnter: () => c.setAttribute("data-active", ""),
          onLeaveBack: () => c.removeAttribute("data-active"),
        }),
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={section} className="relative overflow-hidden lg:h-screen">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
      <div className="relative flex h-full flex-col justify-center py-24 lg:py-0">
        <div className="container-px">
          <SectionHeader
            index="06"
            eyebrow="How PayXa works"
            title="Six steps to live."
            accentWords={["live."]}
            description="From sign-up to verified payments. Scroll through the flow."
          />
          <div className="mt-10 hidden h-px w-full overflow-hidden bg-white/10 lg:block">
            <div ref={bar} className="h-full origin-left scale-x-0 bg-gradient-to-r from-crimson to-neon shadow-[0_0_12px_rgba(255,66,101,0.3)]" />
          </div>
        </div>

        <div
          ref={track}
          className="container-px relative mt-12 flex flex-col gap-4 lg:mx-0 lg:w-max lg:max-w-none lg:flex-row lg:gap-6 lg:pl-[max(40px,calc((100vw-1280px)/2+40px))]"
        >
          {/* mobile vertical line */}
          <div className="absolute top-0 bottom-0 left-[39px] w-px bg-gradient-to-b from-crimson via-white/10 to-transparent sm:left-[51px] lg:hidden" />
          {steps.map((s, i) => (
            <div
              key={s.title}
              data-step
              className="group relative flex gap-5 pl-0 lg:block lg:w-[360px] lg:shrink-0"
            >
              <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border border-white/15 bg-ink font-mono text-[12px] text-muted transition-all duration-500 group-data-[active]:border-crimson group-data-[active]:bg-crimson group-data-[active]:text-white group-data-[active]:shadow-[0_0_24px_rgba(255,66,101,0.3)] lg:hidden">
                0{i + 1}
              </span>
              <div className="card flex-1 p-7 transition-[border-color,transform,box-shadow] duration-700 group-data-[active]:border-crimson/50 group-data-[active]:shadow-[0_30px_80px_-40px_rgba(217,4,41,0.4)] lg:h-[340px] lg:p-9">
                <div className="flex items-center justify-between">
                  <s.icon size={26} className="text-dim transition-colors duration-500 group-data-[active]:text-neon" />
                  <span className="hidden font-display text-6xl font-bold text-white/[0.05] transition-colors duration-700 group-data-[active]:text-crimson/30 lg:block">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-lg font-semibold uppercase lg:mt-24 lg:text-xl">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{s.body}</p>
              </div>
            </div>
          ))}
          <div className="hidden w-[30vw] shrink-0 lg:block" />
        </div>
      </div>
    </section>
  );
}

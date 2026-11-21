"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { introPlaying } from "./IntroLoader";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisInstance = lenis;
    if (process.env.NODE_ENV !== "production") (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Hold the page still while the cinematic intro plays.
    const resume = () => {
      lenis.start();
      ScrollTrigger.refresh();
    };
    if (introPlaying()) {
      lenis.stop();
      window.addEventListener("payxa:intro-done", resume, { once: true });
    }

    return () => {
      window.removeEventListener("payxa:intro-done", resume);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // Reset scroll on route change and let triggers re-measure
  useEffect(() => {
    if (window.location.hash) return;
    lenisInstance?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}

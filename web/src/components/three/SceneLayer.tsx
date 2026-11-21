"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { sceneStore, type Shape, type Side } from "./sceneStore";
import { introPlaying } from "@/components/fx/IntroLoader";

const Universe = dynamic(() => import("./Universe"), { ssr: false });

/**
 * Global fixed 3D layer behind every page.
 * Any element with data-scene="<shape>" (and optional data-side) drives the
 * particle universe while it crosses the middle of the viewport.
 */
export default function SceneLayer() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let webgl = false;
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
    setEnabled(!reduce && webgl);

    let lastY = window.scrollY;
    let vel = 0;
    let raf = 0;
    const loop = () => {
      const y = window.scrollY;
      vel = vel * 0.85 + (y - lastY) * 0.15;
      lastY = y;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      sceneStore.set({ progress: y / max, velocity: vel });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onMove = (e: PointerEvent) => {
      sceneStore.set({
        pointerX: (e.clientX / window.innerWidth) * 2 - 1,
        pointerY: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  // Watch scene markers on each route
  useEffect(() => {
    let io: IntersectionObserver | null = null;
    // During the cinematic intro the universe warps through a tunnel; the page's
    // first scene (e.g. the hero QR) assembles right as the curtain opens.
    const intro = introPlaying();
    const onIntroDone = () => {
      sceneStore.set({ lock: 0 });
      const first = document.querySelector<HTMLElement>("[data-scene]");
      if (first) sceneStore.set({ shape: (first.dataset.scene as Shape) || "rings", side: (first.dataset.side as Side) || "center" });
    };
    if (intro) {
      sceneStore.set({ shape: "tunnel", side: "center", lock: Date.now() + 60_000 });
      window.addEventListener("payxa:intro-done", onIntroDone, { once: true });
    }
    const id = window.setTimeout(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
      const apply = (el: HTMLElement) =>
        Date.now() > sceneStore.get().lock &&
        sceneStore.set({
          shape: (el.dataset.scene as Shape) || "rings",
          side: (el.dataset.side as Side) || "center",
        });
      if (els[0]) apply(els[0]);
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => e.isIntersecting && apply(e.target as HTMLElement));
        },
        { rootMargin: "-48% 0px -48% 0px" },
      );
      els.forEach((el) => io!.observe(el));
    }, 60);
    return () => {
      window.clearTimeout(id);
      io?.disconnect();
      window.removeEventListener("payxa:intro-done", onIntroDone);
    };
  }, [pathname]);

  return enabled ? <Universe /> : null;
}

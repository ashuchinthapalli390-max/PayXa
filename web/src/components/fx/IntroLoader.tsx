"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Cinematic 5s intro, played on every full page load (refresh / first visit).
 * The overlay is server-rendered and driven by CSS keyframes, so it starts
 * instantly and always clears itself even if JavaScript is slow. JS adds the
 * live counter, skip control and signals the rest of the page when it's done.
 */

const DURATION = 5000;

// Module state survives client-side navigations but resets on a full reload.
let played = false;
let done = false;
const listeners = new Set<() => void>();
const setDone = () => {
  done = true;
  played = true;
  listeners.forEach((l) => l());
  window.dispatchEvent(new Event("payxa:intro-done"));
};

/** True once the intro has finished (or was never shown on this page view). */
export function useIntroDone() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => done,
    () => false,
  );
}

export const introPlaying = () => typeof document !== "undefined" && !!document.getElementById("payxa-intro") && !done;

const statuses = ["Initialising network", "Securing channel", "Syncing UPI nodes", "Pairing alerts", "Ready"];

export default function IntroLoader() {
  const [visible, setVisible] = useState(() => !played);
  const [skipping, setSkipping] = useState(false);
  const counter = useRef<HTMLSpanElement>(null);
  const status = useRef<HTMLSpanElement>(null);
  const timer = useRef<number>(0);

  const finish = useCallback(() => {
    window.clearTimeout(timer.current);
    setVisible(false);
    setDone();
  }, []);

  useEffect(() => {
    if (!visible) {
      if (!done) setDone();
      return;
    }
    // The CSS keyframes are the single source of truth: read the progress bar's
    // own animation clock for the counter, and finish when the curtain has opened.
    const progress = document.querySelector<HTMLElement>(".intro-progress");
    const bottom = document.querySelector<HTMLElement>(".intro-bottom");
    let raf = 0;
    const tick = () => {
      const anim = progress?.getAnimations()[0];
      const t = typeof anim?.currentTime === "number" ? anim.currentTime : 0;
      const k = Math.min(1, Math.max(0, (t - 200) / 3800));
      const eased = 1 - Math.pow(1 - k, 3);
      if (counter.current) counter.current.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      if (status.current) status.current.textContent = statuses[Math.min(statuses.length - 1, Math.floor(k * statuses.length))];
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onEnd = (e: AnimationEvent) => {
      if (e.animationName === "intro-bottom-out") finish();
    };
    bottom?.addEventListener("animationend", onEnd);
    // Safety net in case animation events never fire (e.g. a background tab).
    timer.current = window.setTimeout(finish, DURATION + 2500);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer.current);
      bottom?.removeEventListener("animationend", onEnd);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, finish]);

  const skip = () => {
    if (skipping) return;
    setSkipping(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(finish, 1200); // animationend normally fires first (~0.72s)
  };

  if (!visible) return null;

  return (
    <div id="payxa-intro" className={`intro ${skipping ? "is-skipping" : ""}`} role="status" aria-live="polite" aria-label="Loading PayXa">
      <div className="intro-half intro-top" />
      <div className="intro-half intro-bottom" />

      <div className="intro-stage" aria-hidden>
        <div className="intro-glow" />
        <div className="intro-floor">
          <div className="floor-grid" />
        </div>
        <div className="intro-grain" />
        <div className="intro-bar intro-bar-top" />
        <div className="intro-bar intro-bar-bottom" />
        <div className="intro-horizon" />

        <svg className="intro-orbits" viewBox="0 0 600 600">
          <ellipse cx="300" cy="300" rx="250" ry="88" transform="rotate(-18 300 300)" pathLength="1" />
          <ellipse cx="300" cy="300" rx="270" ry="130" transform="rotate(28 300 300)" pathLength="1" />
          <circle cx="300" cy="300" r="190" pathLength="1" />
          <circle className="intro-node" cx="535" cy="225" r="5" />
          <circle className="intro-node intro-node-2" cx="70" cy="378" r="4" />
        </svg>

        <div className="intro-center">
          <div className="intro-mark">
            <Image src="/brand/payxa-mark.png" alt="" width={570} height={295} priority unoptimized className="h-auto w-full" />
            <span className="intro-sweep" />
          </div>
          <div className="intro-word">
            {["P", "A", "Y", "X", "A"].map((ch, i) => (
              <span key={i} className={ch === "X" && i === 3 ? "is-x" : ""} style={{ animationDelay: `${1.75 + i * 0.09}s` }}>
                {ch}
              </span>
            ))}
          </div>
          <div className="intro-tagline">Payments. Connected.</div>
          <div className="intro-powered">
            <span className="intro-rule" />
            Powered by
            <Image src="/brand/codexa-mark.png" alt="" width={22} height={22} unoptimized className="size-[22px] rounded" />
            <strong>CodeXa Agency</strong>
            <span className="intro-rule" />
          </div>
        </div>

        <div className="intro-meta intro-meta-left">
          <span className="intro-dot" />
          <span ref={status}>Initialising network</span>
        </div>
        <div className="intro-meta intro-meta-right">
          <span ref={counter}>000</span>
          <span className="opacity-50">%</span>
        </div>
        <div className="intro-progress" />
        <div className="intro-flash" />
      </div>

      <button type="button" onClick={skip} className="intro-skip">
        Skip intro
      </button>
    </div>
  );
}

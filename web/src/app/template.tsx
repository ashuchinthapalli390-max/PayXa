import type { ReactNode } from "react";

/**
 * Route transition: crimson + black panels wipe away to reveal the page.
 * Pure CSS so it plays (and finishes) even before JavaScript hydrates.
 * template.tsx remounts on every navigation, so the wipe replays per route.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <div aria-hidden className="page-wipe page-wipe-red" />
      <div aria-hidden className="page-wipe page-wipe-ink">
        <span className="font-mono text-[11px] tracking-[0.4em] text-dim uppercase">PayXa</span>
      </div>
      <div className="page-enter">{children}</div>
    </>
  );
}

export type Shape =
  | "qr"
  | "card"
  | "coin"
  | "check"
  | "bars"
  | "torus"
  | "helix"
  | "grid"
  | "cube"
  | "shield"
  | "phone"
  | "rings"
  | "tunnel"
  | "rupee"
  | "payxa";

export type Side = "left" | "right" | "center";

type State = {
  shape: Shape;
  side: Side;
  progress: number; // whole-page scroll 0..1
  velocity: number; // smoothed scroll velocity
  pointerX: number; // -1..1
  pointerY: number; // -1..1
  lock: number; // while > now (ms), section observers must not override shape (pinned sections drive it)
};

const state: State = { shape: "qr", side: "right", progress: 0, velocity: 0, pointerX: 0, pointerY: 0, lock: 0 };
const listeners = new Set<() => void>();

/** Tiny mutable store read every frame by the 3D scene (no React re-renders). */
export const sceneStore = {
  get: () => state,
  set(p: Partial<State>) {
    Object.assign(state, p);
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

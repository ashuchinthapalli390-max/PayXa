import type { Shape } from "./sceneStore";
import { getQr } from "@/lib/qr";

/** Deterministic PRNG so shapes are stable between renders. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Gen = (n: number) => Float32Array;

const torus: Gen = (n) => {
  const r = rng(2);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = r() * Math.PI * 2;
    const v = r() * Math.PI * 2;
    const R = 2.1;
    const tube = 0.55 + (r() - 0.5) * 0.08;
    out.set([(R + tube * Math.cos(v)) * Math.cos(u), tube * Math.sin(v), (R + tube * Math.cos(v)) * Math.sin(u)], i * 3);
  }
  return out;
};

const helix: Gen = (n) => {
  const r = rng(3);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const kind = r();
    const t = r();
    const y = (t - 0.5) * 6.4;
    const a = t * Math.PI * 7;
    if (kind < 0.78) {
      const strand = kind < 0.39 ? 0 : Math.PI;
      const rad = 1.05 + (r() - 0.5) * 0.12;
      out.set([Math.cos(a + strand) * rad, y, Math.sin(a + strand) * rad], i * 3);
    } else {
      // rungs between strands
      const step = Math.round(t * 46) / 46;
      const ys = (step - 0.5) * 6.4;
      const as = step * Math.PI * 7;
      const m = r() * 2 - 1;
      out.set([Math.cos(as) * 1.05 * m, ys, Math.sin(as) * 1.05 * m], i * 3);
    }
  }
  return out;
};

const grid: Gen = (n) => {
  const out = new Float32Array(n * 3);
  const side = Math.ceil(Math.sqrt(n));
  for (let i = 0; i < n; i++) {
    const x = (i % side) / (side - 1) - 0.5;
    const z = Math.floor(i / side) / (side - 1) - 0.5;
    out.set([x * 11, -1.4, z * 9 - 1], i * 3);
  }
  return out;
};

const cube: Gen = (n) => {
  const r = rng(5);
  const out = new Float32Array(n * 3);
  const s = 1.45;
  for (let i = 0; i < n; i++) {
    const face = Math.floor(r() * 6);
    const a = (Math.round(r() * 14) / 14) * 2 - 1;
    const b = (Math.round(r() * 14) / 14) * 2 - 1;
    const p = [a * s, b * s, (face % 2 ? 1 : -1) * s];
    const axis = Math.floor(face / 2);
    const v = axis === 0 ? [p[2], p[0], p[1]] : axis === 1 ? [p[0], p[2], p[1]] : p;
    out.set(v, i * 3);
  }
  return out;
};

/** Points along the edges of an icosahedron cage. */
const shield: Gen = (n) => {
  const r = rng(6);
  const t = (1 + Math.sqrt(5)) / 2;
  const v = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ].map((p) => {
    const l = Math.hypot(p[0], p[1], p[2]);
    return p.map((c) => (c / l) * 1.9);
  });
  const edges: [number, number][] = [];
  for (let i = 0; i < 12; i++)
    for (let j = i + 1; j < 12; j++) {
      const d = Math.hypot(v[i][0] - v[j][0], v[i][1] - v[j][1], v[i][2] - v[j][2]);
      if (d < 2.1) edges.push([i, j]);
    }
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    if (r() < 0.82) {
      const [a, b] = edges[Math.floor(r() * edges.length)];
      const k = r();
      out.set([0, 1, 2].map((c) => v[a][c] + (v[b][c] - v[a][c]) * k + (r() - 0.5) * 0.04), i * 3);
    } else {
      // inner core
      const u = r() * Math.PI * 2;
      const w = Math.acos(2 * r() - 1);
      const rad = 0.55 * Math.cbrt(r());
      out.set([rad * Math.sin(w) * Math.cos(u), rad * Math.sin(w) * Math.sin(u), rad * Math.cos(w)], i * 3);
    }
  }
  return out;
};

/** Real QR matrix, extruded into 3D voxel columns. */
const qr: Gen = (n) => {
  const r = rng(7);
  const q = getQr();
  const size = q.size;
  const on: [number, number][] = [];
  const c0 = size / 2 - 4;
  const c1 = size / 2 + 4;
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) if (q.on(x, y) && !(x > c0 && x < c1 && y > c0 && y < c1)) on.push([x, y]);
  // The QR itself is drawn as solid voxels (see QRVoxels); particles form the scanner field around it.
  const out = new Float32Array(n * 3);
  const half = 1.75;
  for (let i = 0; i < n; i++) {
    const k = r();
    if (k < 0.3) {
      // faint module echo just behind the voxels
      const [x, y] = on[Math.floor(r() * on.length)];
      out.set([((x + 0.5) / size - 0.5) * 3.3, (0.5 - (y + 0.5) / size) * 3.3, -0.12 - r() * 0.1], i * 3);
    } else if (k < 0.55) {
      // glowing frame
      const t = r() * 4;
      const e = Math.floor(t);
      const f = (t - e) * 2 - 1;
      const pts: [number, number][] = [
        [f * half, half],
        [half, f * half],
        [f * half, -half],
        [-half, f * half],
      ];
      out.set([pts[e][0] + (r() - 0.5) * 0.05, pts[e][1] + (r() - 0.5) * 0.05, (r() - 0.5) * 0.08], i * 3);
    } else {
      // data dust streaming out the back
      out.set([(r() - 0.5) * 4.4, (r() - 0.5) * 4.4, -0.4 - r() * 3], i * 3);
    }
  }
  return out;
};

function roundedRect(W: number, H: number, rad: number, t: number): [number, number] {
  const sw = W - 2 * rad;
  const sh = H - 2 * rad;
  const arc = (Math.PI / 2) * rad;
  const L = 2 * sw + 2 * sh + 4 * arc;
  let d = t * L;
  const segs: [number, (k: number) => [number, number]][] = [
    [sw, (k) => [-sw / 2 + k * sw, H / 2]],
    [arc, (k) => [sw / 2 + Math.sin((k * Math.PI) / 2) * rad, sh / 2 + Math.cos((k * Math.PI) / 2) * rad]],
    [sh, (k) => [W / 2, sh / 2 - k * sh]],
    [arc, (k) => [sw / 2 + Math.cos((k * Math.PI) / 2) * rad, -sh / 2 - Math.sin((k * Math.PI) / 2) * rad]],
    [sw, (k) => [sw / 2 - k * sw, -H / 2]],
    [arc, (k) => [-sw / 2 - Math.sin((k * Math.PI) / 2) * rad, -sh / 2 - Math.cos((k * Math.PI) / 2) * rad]],
    [sh, (k) => [-W / 2, -sh / 2 + k * sh]],
    [arc, (k) => [-sw / 2 - Math.cos((k * Math.PI) / 2) * rad, sh / 2 + Math.sin((k * Math.PI) / 2) * rad]],
  ];
  for (const [len, f] of segs) {
    if (d <= len) return f(d / len);
    d -= len;
  }
  return [0, 0];
}

/** Payment card: outline, EMV chip, contactless waves, number groups. */
const card: Gen = (n) => {
  const r = rng(21);
  const out = new Float32Array(n * 3);
  const W = 3.6;
  const H = 2.27;
  for (let i = 0; i < n; i++) {
    const k = r();
    let p: [number, number, number];
    if (k < 0.34) {
      const [x, y] = roundedRect(W, H, 0.22, r());
      p = [x, y, (r() - 0.5) * 0.06];
    } else if (k < 0.52) {
      // faint card face
      p = [(r() - 0.5) * W * 0.96, (r() - 0.5) * H * 0.94, -0.04];
    } else if (k < 0.66) {
      // chip
      const [x, y] = roundedRect(0.62, 0.48, 0.08, r());
      p = [x - 1.1, y + 0.2, 0.04];
      if (r() < 0.4) p = [-1.1 + (r() - 0.5) * 0.6, 0.2 + (Math.round(r() * 3) / 3 - 0.5) * 0.44, 0.04];
    } else if (k < 0.78) {
      // contactless arcs
      const ring = 1 + Math.floor(r() * 3);
      const a = (r() - 0.5) * 1.3;
      p = [1.25 + Math.cos(a) * 0.14 * ring, 0.55 + Math.sin(a) * 0.14 * ring, 0.04];
    } else {
      // card number: 4 groups of 4 dots
      const g = Math.floor(r() * 4);
      const d = Math.floor(r() * 4);
      p = [-1.45 + g * 0.82 + d * 0.16 + (r() - 0.5) * 0.04, -0.45 + (r() - 0.5) * 0.06, 0.04];
    }
    out.set(p, i * 3);
  }
  return out;
};

/** Verified checkmark inside a dotted badge. */
const check: Gen = (n) => {
  const r = rng(22);
  const out = new Float32Array(n * 3);
  const a: [number, number] = [-0.95, 0.05];
  const b: [number, number] = [-0.25, -0.7];
  const c: [number, number] = [1.1, 0.9];
  const l1 = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const l2 = Math.hypot(c[0] - b[0], c[1] - b[1]);
  for (let i = 0; i < n; i++) {
    const k = r();
    if (k < 0.62) {
      let t = r() * (l1 + l2);
      let x: number, y: number;
      if (t < l1) {
        t /= l1;
        x = a[0] + (b[0] - a[0]) * t;
        y = a[1] + (b[1] - a[1]) * t;
      } else {
        t = (t - l1) / l2;
        x = b[0] + (c[0] - b[0]) * t;
        y = b[1] + (c[1] - b[1]) * t;
      }
      out.set([x + (r() - 0.5) * 0.22, y + (r() - 0.5) * 0.22, (r() - 0.5) * 0.25], i * 3);
    } else {
      const ang = r() * Math.PI * 2;
      const rad = 2 + (r() - 0.5) * 0.1 + (Math.sin(ang * 10) > 0.6 ? 0.12 : 0);
      out.set([Math.cos(ang) * rad, Math.sin(ang) * rad, (r() - 0.5) * 0.2], i * 3);
    }
  }
  return out;
};

/** Rising 3D bar chart. */
const bars: Gen = (n) => {
  const r = rng(23);
  const out = new Float32Array(n * 3);
  const heights = [0.9, 1.4, 1.15, 2.0, 1.7, 2.6, 3.2];
  const w = 0.42;
  for (let i = 0; i < n; i++) {
    const b = Math.floor(r() * heights.length);
    const h = heights[b];
    const x0 = (b - (heights.length - 1) / 2) * 0.62;
    const face = r();
    let x = x0 + (r() - 0.5) * w;
    let y = -1.6 + r() * h;
    let z = (r() - 0.5) * w;
    if (face < 0.25) y = -1.6 + h;
    else if (face < 0.5) x = x0 + (r() < 0.5 ? -w / 2 : w / 2);
    else if (face < 0.75) z = r() < 0.5 ? -w / 2 : w / 2;
    else {
      // trend line above bars
      const t = r();
      const bi = t * (heights.length - 1);
      const lo = Math.floor(bi);
      const hi = Math.min(heights.length - 1, lo + 1);
      x = (bi - (heights.length - 1) / 2) * 0.62;
      y = -1.6 + heights[lo] + (heights[hi] - heights[lo]) * (bi - lo) + 0.35;
      z = 0;
    }
    out.set([x, y, z], i * 3);
  }
  return out;
};

const phone: Gen = (n) => {
  const r = rng(8);
  const W = 1.45;
  const H = 3.0;
  const rad = 0.28;
  const out = new Float32Array(n * 3);
  const perimeter = (t: number): [number, number] => {
    // walk a rounded rectangle
    const sw = W - 2 * rad;
    const sh = H - 2 * rad;
    const arc = (Math.PI / 2) * rad;
    const L = 2 * sw + 2 * sh + 4 * arc;
    let d = t * L;
    const segs: [number, (k: number) => [number, number]][] = [
      [sw, (k) => [-sw / 2 + k * sw, H / 2]],
      [arc, (k) => [sw / 2 + Math.sin((k * Math.PI) / 2) * rad, sh / 2 + Math.cos((k * Math.PI) / 2) * rad]],
      [sh, (k) => [W / 2, sh / 2 - k * sh]],
      [arc, (k) => [sw / 2 + Math.cos((k * Math.PI) / 2) * rad, -sh / 2 - Math.sin((k * Math.PI) / 2) * rad]],
      [sw, (k) => [sw / 2 - k * sw, -H / 2]],
      [arc, (k) => [-sw / 2 - Math.sin((k * Math.PI) / 2) * rad, -sh / 2 - Math.cos((k * Math.PI) / 2) * rad]],
      [sh, (k) => [-W / 2, -sh / 2 + k * sh]],
      [arc, (k) => [-sw / 2 - Math.cos((k * Math.PI) / 2) * rad, sh / 2 + Math.sin((k * Math.PI) / 2) * rad]],
    ];
    for (const [len, f] of segs) {
      if (d <= len) return f(d / len);
      d -= len;
    }
    return [0, 0];
  };
  for (let i = 0; i < n; i++) {
    const k = r();
    if (k < 0.55) {
      const [x, y] = perimeter(r());
      out.set([x, y, (r() - 0.5) * 0.18], i * 3);
    } else if (k < 0.8) {
      // notification cards on the screen
      const card = Math.floor(r() * 3);
      out.set([(r() - 0.5) * 1.1, 0.95 - card * 0.62 + (r() - 0.5) * 0.4, 0.05], i * 3);
    } else {
      out.set([(r() - 0.5) * 2.6, (r() - 0.5) * 4, (r() - 0.5) * 1.6], i * 3);
    }
  }
  return out;
};

const rings: Gen = (n) => {
  const r = rng(9);
  const out = new Float32Array(n * 3);
  const tilts = [
    [1.2, 0.2],
    [1.75, -0.5],
    [0.4, 0.9],
    [2.4, 1.3],
    [0.9, -1.1],
  ];
  for (let i = 0; i < n; i++) {
    const ring = Math.floor(r() * tilts.length);
    const R = 1.4 + ring * 0.38 + (r() - 0.5) * 0.05;
    const a = r() * Math.PI * 2;
    let x = Math.cos(a) * R;
    let y = Math.sin(a) * R;
    let z = 0;
    const [tx, ty] = tilts[ring];
    // rotate X then Y
    const y1 = y * Math.cos(tx) - z * Math.sin(tx);
    const z1 = y * Math.sin(tx) + z * Math.cos(tx);
    y = y1;
    z = z1;
    const x2 = x * Math.cos(ty) + z * Math.sin(ty);
    z = -x * Math.sin(ty) + z * Math.cos(ty);
    x = x2;
    out.set([x, y, z], i * 3);
  }
  return out;
};

const tunnel: Gen = (n) => {
  const r = rng(10);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const rad = 2.2 + r() * 1.6;
    out.set([Math.cos(a) * rad, Math.sin(a) * rad, -22 + r() * 28], i * 3);
  }
  return out;
};

function textShape(text: string, width: number, seed: number): Gen {
  return (n) => {
    const out = new Float32Array(n * 3);
    if (typeof document === "undefined") return out;
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 360;
    const g = c.getContext("2d")!;
    g.fillStyle = "#fff";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = `800 ${text.length > 3 ? 230 : 300}px "Unbounded Variable", "Arial Black", Arial, sans-serif`;
    g.fillText(text, 512, 190);
    const data = g.getImageData(0, 0, c.width, c.height).data;
    const pts: [number, number][] = [];
    for (let y = 0; y < c.height; y += 3)
      for (let x = 0; x < c.width; x += 3) if (data[(y * c.width + x) * 4 + 3] > 128) pts.push([x, y]);
    const r = rng(seed);
    const scale = width / 1024;
    for (let i = 0; i < n; i++) {
      const [x, y] = pts.length ? pts[Math.floor(r() * pts.length)] : [512, 180];
      out.set([(x - 512) * scale, (180 - y) * scale, (r() - 0.5) * 0.3], i * 3);
    }
    return out;
  };
}

/** ₹ coin: glyph face plus a thick rim. */
const coin: Gen = (n) => {
  const r = rng(24);
  const face = textShape("₹", 3.6, 25)(n);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    if (r() < 0.5) {
      out.set([face[i * 3] * 0.9, face[i * 3 + 1] * 0.9 + 0.05, (r() < 0.5 ? 0.14 : -0.14) + (r() - 0.5) * 0.04], i * 3);
    } else {
      const a = r() * Math.PI * 2;
      const rad = r() < 0.75 ? 2.05 : 1.8;
      out.set([Math.cos(a) * rad, Math.sin(a) * rad, (r() - 0.5) * 0.34], i * 3);
    }
  }
  return out;
};

const generators: Record<Shape, Gen> = {
  card,
  coin,
  check,
  bars,
  torus,
  helix,
  grid,
  cube,
  shield,
  qr,
  phone,
  rings,
  tunnel,
  rupee: textShape("₹0", 5.2, 11),
  payxa: textShape("PAYXA", 8.6, 12),
};

const cache = new Map<string, Float32Array>();
export function getShape(shape: Shape, n: number) {
  const key = `${shape}:${n}`;
  let v = cache.get(key);
  if (!v) {
    v = generators[shape](n);
    cache.set(key, v);
  }
  return v;
}

/** Shapes that should stay facing the camera (text) instead of spinning. */
export const facing: Partial<Record<Shape, boolean>> = {
  rupee: true,
  payxa: true,
  qr: true,
  phone: true,
  grid: true,
  tunnel: true,
  card: true,
  check: true,
};

/** Optional per-shape tint (e.g. verified = green). */
export const tints: Partial<Record<Shape, [number, number, number, number]>> = {
  check: [0.17, 0.84, 0.48, 0.85],
  qr: [1, 0.86, 0.9, 0.45],
};

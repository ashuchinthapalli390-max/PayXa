"use client";

import { useMemo, useRef, useState } from "react";

const fmt = (v: number) => `₹${v.toLocaleString("en-IN")}`;

/**
 * Single-series area chart (verified volume). One series → no legend, the panel
 * title names it. 2px line, recessive grid, crosshair + tooltip on hover/focus.
 */
export function AreaChart({ data, height = 240 }: { data: { date: string; value: number; count: number }[]; height?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const ref = useRef<SVGSVGElement>(null);
  const W = 640;
  const H = height;
  const pad = { l: 52, r: 12, t: 12, b: 28 };
  const max = useMemo(() => Math.ceil(Math.max(...data.map((d) => d.value)) / 5000) * 5000, [data]);
  const x = (i: number) => pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v / max) * (H - pad.t - pad.b);
  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.value)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((k) => Math.round(max * k));
  const day = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

  const onMove = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = ((clientX - r.left) / r.width) * W;
    const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  };

  const h = hover !== null ? data[hover] : null;
  return (
    <div className="relative">
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-none select-none"
        role="img"
        aria-label={`Verified volume over the last ${data.length} days`}
        tabIndex={0}
        onPointerMove={(e) => onMove(e.clientX)}
        onPointerLeave={() => setHover(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setHover((v) => Math.min(data.length - 1, (v ?? -1) + 1));
          if (e.key === "ArrowLeft") setHover((v) => Math.max(0, (v ?? data.length) - 1));
        }}
        onBlur={() => setHover(null)}
      >
        <defs>
          <linearGradient id="vol-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ff4265" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#ff4265" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="rgba(255,255,255,0.06)" strokeDasharray={t === 0 ? undefined : "3 4"} />
            <text x={pad.l - 10} y={y(t) + 4} textAnchor="end" className="fill-[#6c6a72] font-mono text-[10px]">
              {t >= 1000 ? `₹${t / 1000}k` : `₹${t}`}
            </text>
          </g>
        ))}
        {data.map((d, i) =>
          (data.length - 1 - i) % 3 === 0 ? (
            <text key={d.date} x={x(i)} y={H - 8} textAnchor="middle" className="fill-[#6c6a72] font-mono text-[10px]">
              {day(d.date)}
            </text>
          ) : null,
        )}
        <path d={area} fill="url(#vol-fill)" />
        <path d={line} fill="none" stroke="#ff4265" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {h && hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={y(0)} stroke="rgba(255,255,255,0.25)" />
            <circle cx={x(hover)} cy={y(h.value)} r={5} fill="#ff4265" stroke="#0f0e12" strokeWidth={2} />
          </g>
        )}
      </svg>
      {h && hover !== null && (
        <div
          className="pointer-events-none absolute top-2 z-10 rounded-xl border border-white/10 bg-[#17151b]/95 px-3 py-2 shadow-xl backdrop-blur"
          style={{ left: `${(x(hover) / W) * 100}%`, transform: `translateX(${hover > data.length / 2 ? "-110%" : "10%"})` }}
        >
          <div className="font-mono text-[10px] text-dim">{day(h.date)}</div>
          <div className="text-[14px] font-semibold text-paper">{fmt(h.value)}</div>
          <div className="text-[11px] text-muted">{h.count} verified payments</div>
        </div>
      )}
    </div>
  );
}

/** Hourly checkouts: single-series bars, 4px rounded tops anchored to the baseline, per-bar tooltip. */
export function HourBars({ data }: { data: number[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data);
  return (
    <div>
      <div className="relative flex h-36 items-end gap-[2px]" onPointerLeave={() => setHover(null)}>
        {data.map((v, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i}:00 — ${v} checkouts`}
            onPointerEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            className="group relative flex h-full flex-1 items-end"
          >
            <span
              className={`w-full rounded-t-[4px] transition-colors ${hover === i ? "bg-neon" : "bg-crimson/70 group-hover:bg-neon"}`}
              style={{ height: `${Math.max(3, (v / max) * 100)}%` }}
            />
            {hover === i && (
              <span className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-lg border border-white/10 bg-[#17151b] px-2 py-1 font-mono text-[11px] whitespace-nowrap text-paper shadow-lg">
                {String(i).padStart(2, "0")}:00 · {v}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-dim">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:00</span>
      </div>
    </div>
  );
}

/** Status mix as one segmented bar; legend always present, labels carry the numbers. */
export function StatusMix({ items }: { items: { label: string; value: number; color: string }[] }) {
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  return (
    <div>
      <div className="flex h-3 gap-[2px] overflow-hidden rounded-full">
        {items.map((it) => (
          <span key={it.label} title={`${it.label}: ${it.value}`} className="h-full first:rounded-l-full last:rounded-r-full" style={{ width: `${(it.value / total) * 100}%`, background: it.color }} />
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
        {items.map((it) => (
          <li key={it.label} className="flex items-center gap-2 text-[13px]">
            <span className="size-2.5 rounded-sm" style={{ background: it.color }} />
            <span className="text-muted">{it.label}</span>
            <span className="ml-auto font-mono text-paper tabular-nums">{it.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BellRing, Code2, Link2, Play, QrCode, Radar, ShieldCheck, Smartphone } from "lucide-react";
import { useCheckout } from "@/components/checkout/CheckoutProvider";

type Ev = { id: number; kind: "started" | "detected" | "verified"; order: string; amount: string; at: string };

const seed: Ev[] = [
  { id: 3, kind: "started", order: "PXA-20484", amount: "₹499.00", at: "now" },
  { id: 2, kind: "detected", order: "PXA-20483", amount: "₹1,299.00", at: "1m" },
  { id: 1, kind: "verified", order: "PXA-20482", amount: "₹799.00", at: "3m" },
  { id: 0, kind: "verified", order: "PXA-20480", amount: "₹2,500.00", at: "6m" },
];

const meta = {
  started: { icon: BellRing, label: "Checkout started", tone: "text-sky-300", dot: "bg-sky-300" },
  detected: { icon: Radar, label: "Credit detected", tone: "text-warn", dot: "bg-warn" },
  verified: { icon: ShieldCheck, label: "Payment verified", tone: "text-ok", dot: "bg-ok" },
};

/** Test-mode live activity: new events stream in so the feed feels realtime. */
export function LiveFeed() {
  const [events, setEvents] = useState(seed);
  useEffect(() => {
    let n = 20485;
    let id = 10;
    const amounts = ["₹349.00", "₹499.00", "₹1,050.00", "₹1,899.00", "₹250.00"];
    const t = window.setInterval(() => {
      const kinds: Ev["kind"][] = ["started", "detected", "verified"];
      const kind = kinds[id % 3];
      const order = kind === "started" ? `PXA-${n++}` : `PXA-${n - 1}`;
      setEvents((e) => [{ id: id++, kind, order, amount: amounts[id % amounts.length], at: "now" }, ...e].slice(0, 6));
    }, 5000);
    return () => window.clearInterval(t);
  }, []);
  return (
    <ul className="divide-y divide-white/[0.04]" aria-live="polite">
      <AnimatePresence initial={false}>
        {events.map((e) => {
          const m = meta[e.kind];
          return (
            <motion.li
              key={e.id}
              layout
              initial={{ opacity: 0, y: -12, backgroundColor: "rgba(255,66,101,0.12)" }}
              animate={{ opacity: 1, y: 0, backgroundColor: "rgba(255,66,101,0)" }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 px-5 py-3"
            >
              <span className={`grid size-8 place-items-center rounded-lg bg-white/[0.04] ${m.tone}`}>
                <m.icon size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium">{m.label}</div>
                <div className="font-mono text-[11px] text-dim">{e.order}</div>
              </div>
              <div className="text-right">
                <div className="text-[13px] font-semibold tabular-nums">{e.amount}</div>
                <div className="font-mono text-[10px] text-dim">{e.at}</div>
              </div>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}

export function QuickActions() {
  const { openCheckout } = useCheckout();
  const items = [
    { icon: Play, label: "Run test checkout", onClick: () => openCheckout({ merchant: "Aurora Store" }) },
    { icon: Link2, label: "New payment link", href: "/dashboard/links" },
    { icon: Smartphone, label: "Pair a device", href: "/dashboard/devices" },
    { icon: QrCode, label: "Download QR", href: "/dashboard/qr" },
    { icon: Code2, label: "API keys", href: "/dashboard/developers" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {items.map((it) => {
        const inner = (
          <>
            <span className="grid size-9 place-items-center rounded-xl bg-crimson/10 text-neon transition-transform group-hover:scale-110">
              <it.icon size={17} />
            </span>
            <span className="text-[12px] font-medium">{it.label}</span>
          </>
        );
        const cls = "group flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-[#0f0e12] p-4 text-center transition-colors hover:border-crimson/40";
        return it.href ? (
          <Link key={it.label} href={it.href} className={cls}>
            {inner}
          </Link>
        ) : (
          <button key={it.label} type="button" onClick={it.onClick} className={cls}>
            {inner}
          </button>
        );
      })}
    </div>
  );
}

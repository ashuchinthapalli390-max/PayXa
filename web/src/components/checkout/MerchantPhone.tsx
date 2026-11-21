"use client";

import { AnimatePresence, motion } from "motion/react";
import { BellRing, Radar, ShieldCheck, Smartphone } from "lucide-react";
import { PhoneFrame, StatusBar } from "@/components/ui/Section";
import { formatINR, useCheckout } from "./CheckoutProvider";

const ease = [0.16, 1, 0.3, 1] as const;

/** Merchant phone that mirrors the live checkout session. */
export default function MerchantPhone({ className = "" }: { className?: string }) {
  const { status, order, events } = useCheckout();
  const started = events.some((e) => e.type === "checkout.started");
  const amount = order ? formatINR(order.amount) : "";
  const cards = [
    started && { k: "start", icon: BellRing, title: "Payment Started", amount, sub: `Order ${order?.id} · Awaiting customer`, tone: "text-neon", ring: "border-crimson/40" },
    (status === "detected" || status === "verifying" || status === "verified") && {
      k: "det",
      icon: Radar,
      title: "Incoming Credit Detected",
      amount: `${amount} · Verifying`,
      sub: "Matched to active checkout",
      tone: "text-warn",
      ring: "border-warn/40",
    },
    status === "verified" && { k: "ver", icon: ShieldCheck, title: "Payment Verified", amount: `${amount} · Successful`, sub: "Trusted confirmation received", tone: "text-ok", ring: "border-ok/40" },
  ].filter(Boolean) as { k: string; icon: typeof BellRing; title: string; amount: string; sub: string; tone: string; ring: string }[];

  const base = 2495000;
  const total = status === "verified" && order ? base + order.amount : base;

  return (
    <PhoneFrame className={className}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(217,4,41,0.18),transparent_60%)]" />
      <div className="relative">
        <StatusBar />
        <div className="px-5 pt-6">
          <div className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">PayXa Merchant</div>
          <motion.div key={total} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-1 font-display text-[22px] font-semibold">
            {formatINR(total).replace(".00", "")}
          </motion.div>
          <div className="text-[11px] text-dim">Verified today</div>
        </div>
        <div className="mt-5 space-y-2.5 px-3">
          <AnimatePresence initial={false}>
            {[...cards].reverse().map((n) => (
              <motion.div
                key={n.k}
                layout
                initial={{ opacity: 0, y: -40, scale: 0.9, rotateX: -40 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease }}
                style={{ transformPerspective: 600 }}
                className={`rounded-2xl border ${n.ring} bg-[#141217]/95 p-3 backdrop-blur`}
              >
                <div className="flex items-center justify-between text-[10px] text-dim">
                  <span className="flex items-center gap-1.5">
                    <span className="grid size-4 place-items-center rounded bg-crimson text-[8px] font-bold text-white">P</span>
                    PayXa · Live Alerts
                  </span>
                  now
                </div>
                <div className={`mt-2 flex items-center gap-1.5 text-[13px] font-semibold ${n.tone}`}>
                  <n.icon size={13} /> {n.title}
                </div>
                <div className="mt-0.5 text-[13px] font-semibold text-paper">{n.amount}</div>
                <div className="text-[11px] text-muted">{n.sub}</div>
              </motion.div>
            ))}
          </AnimatePresence>
          {cards.length === 0 && (
            <div className="mt-10 flex flex-col items-center gap-3 text-center text-[12px] text-dim">
              <Smartphone size={22} />
              Waiting for checkout activity…
            </div>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}

export function EventStream({ className = "", title = "Event stream" }: { className?: string; title?: string }) {
  const { events, status } = useCheckout();
  const tone = { muted: "text-muted", neon: "text-neon", warn: "text-warn", ok: "text-ok", bad: "text-neon" } as const;
  return (
    <div className={`card overflow-hidden ${className}`}>
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
        <span className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">{title}</span>
        <span className="flex gap-1.5">
          <span className="size-2 rounded-full bg-white/10" />
          <span className="size-2 rounded-full bg-white/10" />
          <span className="size-2 rounded-full bg-crimson" />
        </span>
      </div>
      <ol className="min-h-[170px] space-y-1.5 px-5 py-4 font-mono text-[12px]" aria-live="polite">
        {events.length === 0 && <li className="text-dim">$ listening for checkout events…</li>}
        {events.map((l, i) => (
          <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
            <span className="shrink-0 text-dim">+{(l.at / 1000).toFixed(2)}s</span>
            <span className={`${tone[l.tone]} break-all`}>{l.text}</span>
          </motion.li>
        ))}
        {events.length > 0 && status !== "verified" && status !== "expired" && <li className="caret text-dim" />}
      </ol>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronRight, Clock, Copy, Loader2, Lock, QrCode, RotateCcw, ShieldCheck, Smartphone, X } from "lucide-react";
import { formatINR, useCheckout } from "./CheckoutProvider";
import { getLenis } from "@/components/fx/SmoothScroll";
import { RealQR, ScannerFrame } from "./RealQR";
import { MERCHANT } from "@/lib/merchant";

const ease = [0.16, 1, 0.3, 1] as const;

/** Test-mode checkout QR: a real QR whose payload is a notice, never a UPI payment URI. */
export function PatternQR({ className = "", scanning = false }: { className?: string; scanning?: boolean }) {
  return <RealQR className={className} scanning={scanning} />;
}

function useCountdown(startedAt: number, active: boolean, total = 300) {
  const [left, setLeft] = useState(total);
  useEffect(() => {
    if (!active) return;
    const tick = () => setLeft(Math.max(0, total - Math.floor((Date.now() - startedAt) / 1000)));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [startedAt, active, total]);
  return `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
}

const steps = [
  { key: "awaiting", label: "Awaiting payment" },
  { key: "detected", label: "Payment detected" },
  { key: "verifying", label: "Verifying with bank" },
  { key: "verified", label: "Payment verified" },
] as const;

export default function CheckoutModal() {
  const { open, status, order, startedAt, close, complete, fail, retry } = useCheckout();
  const [tab, setTab] = useState<"qr" | "app">("qr");
  const [copied, setCopied] = useState(false);
  const countdown = useCountdown(startedAt, open && status === "awaiting");

  useEffect(() => {
    const l = getLenis();
    if (open) l?.stop();
    else l?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (open) setTab("qr");
  }, [open, order?.id]);

  const idx = steps.findIndex((s) => s.key === status);
  const done = status === "verified";
  const bad = status === "failed" || status === "expired";

  return (
    <AnimatePresence>
      {open && order && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="PayXa checkout"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={close} />
          <motion.div
            initial={{ y: 60, rotateX: 18, scale: 0.94, opacity: 0 }}
            animate={{ y: 0, rotateX: 0, scale: 1, opacity: 1 }}
            exit={{ y: 40, rotateX: 10, scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.6, ease }}
            style={{ transformPerspective: 1400 }}
            className="relative max-h-[94svh] w-full max-w-[440px] overflow-y-auto rounded-t-[28px] border border-white/10 bg-[#0c0b0f] shadow-[0_40px_140px_-30px_rgba(217,4,41,0.7)] sm:rounded-[28px]"
            data-lenis-prevent
          >
            {/* Header */}
            <div className="relative overflow-hidden border-b border-white/[0.06] bg-gradient-to-br from-crimson/25 via-transparent to-transparent px-6 pt-6 pb-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {order.merchant === MERCHANT.name ? (
                    <Image src={MERCHANT.mark} alt="" width={44} height={44} className="size-11 rounded-2xl ring-1 ring-white/10" />
                  ) : (
                    <span className="grid size-11 place-items-center rounded-2xl bg-paper font-display text-lg font-bold text-ink">{order.merchant[0]}</span>
                  )}
                  <div>
                    <div className="text-[15px] font-semibold">{order.merchant}</div>
                    <div className="flex items-center gap-1 text-[11px] text-ok">
                      <ShieldCheck size={12} /> Verified merchant
                    </div>
                  </div>
                </div>
                <button onClick={close} aria-label="Close checkout" className="grid size-9 place-items-center rounded-full bg-white/5 text-muted hover:bg-white/10 hover:text-paper">
                  <X size={16} />
                </button>
              </div>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <div className="text-[12px] text-muted">{order.item}</div>
                  <div className="mt-1 font-display text-[34px] leading-none font-semibold tabular-nums">{formatINR(order.amount)}</div>
                </div>
                <div className="text-right font-mono text-[11px] text-muted">
                  {order.id}
                  {status === "awaiting" && (
                    <div className="mt-1 flex items-center justify-end gap-1 text-paper">
                      <Clock size={11} /> {countdown}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease }} className="py-4 text-center">
                    <motion.span
                      initial={{ scale: 0, rotate: -40 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 240, damping: 15 }}
                      className="mx-auto grid size-20 place-items-center rounded-full bg-ok text-ink shadow-[0_0_60px_rgba(43,214,123,0.5)]"
                    >
                      <Check size={38} strokeWidth={3} />
                    </motion.span>
                    <div className="mt-6 font-display text-xl font-semibold uppercase">Payment successful</div>
                    <p className="mt-2 text-[14px] text-muted">
                      {formatINR(order.amount)} paid to {order.merchant}
                    </p>
                    <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-left font-mono text-[11px]">
                      <span className="text-dim">Order</span>
                      <span className="text-right text-paper">{order.id}</span>
                      <span className="text-dim">Status</span>
                      <span className="text-right text-ok">PAYMENT_VERIFIED</span>
                      <span className="text-dim">Source</span>
                      <span className="text-right text-paper">BANK_PSP</span>
                    </div>
                    <button onClick={close} className="btn btn-primary mt-6 w-full">
                      Return to {order.merchant}
                    </button>
                  </motion.div>
                ) : bad ? (
                  <motion.div key="bad" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6 text-center">
                    <span className="mx-auto grid size-16 place-items-center rounded-full border border-crimson/50 bg-crimson/10 text-neon">
                      <X size={28} />
                    </span>
                    <div className="mt-5 font-display text-lg font-semibold uppercase">Payment not received</div>
                    <p className="mt-2 text-[14px] text-muted">This session expired before a verified payment arrived. No money was taken.</p>
                    <button onClick={retry} className="btn btn-primary mt-6 w-full">
                      <RotateCcw size={14} /> Try again
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="pay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {status === "awaiting" ? (
                      <>
                        <div role="tablist" className="grid grid-cols-2 gap-1 rounded-full bg-white/[0.04] p-1">
                          {[
                            { id: "qr" as const, label: "Scan QR", icon: QrCode },
                            { id: "app" as const, label: "UPI app", icon: Smartphone },
                          ].map((t) => (
                            <button
                              key={t.id}
                              role="tab"
                              aria-selected={tab === t.id}
                              onClick={() => setTab(t.id)}
                              className={`relative flex items-center justify-center gap-2 rounded-full py-2.5 text-[13px] font-medium transition-colors ${tab === t.id ? "text-white" : "text-muted"}`}
                            >
                              {tab === t.id && <motion.span layoutId="ck-tab" className="absolute inset-0 rounded-full bg-crimson" />}
                              <t.icon size={14} className="relative" />
                              <span className="relative">{t.label}</span>
                            </button>
                          ))}
                        </div>

                        <AnimatePresence mode="wait">
                          {tab === "qr" ? (
                            <motion.div key="qr" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-6">
                              <ScannerFrame className="mx-auto w-[210px]">
                                <PatternQR />
                              </ScannerFrame>
                              <p className="mt-3 text-center text-[13px] text-muted">Scan with any UPI app to pay {formatINR(order.amount)}</p>
                            </motion.div>
                          ) : (
                            <motion.div key="app" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-6 space-y-3">
                              <button onClick={complete} className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-left transition-colors hover:border-crimson/50">
                                <span className="grid size-11 place-items-center rounded-xl bg-crimson/15 text-neon">
                                  <Smartphone size={20} />
                                </span>
                                <span className="flex-1">
                                  <span className="block text-[14px] font-semibold">Pay with a UPI app</span>
                                  <span className="block text-[12px] text-muted">Opens the UPI apps on this phone</span>
                                </span>
                                <ChevronRight size={18} className="text-dim" />
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText("codexa@payxatest");
                                    setCopied(true);
                                    window.setTimeout(() => setCopied(false), 1400);
                                  } catch {
                                    /* ignore */
                                  }
                                }}
                                className="flex w-full items-center justify-between rounded-2xl border border-white/10 px-4 py-3 font-mono text-[12px] text-muted hover:text-paper"
                              >
                                codexa@payxatest
                                <span className="flex items-center gap-1.5">
                                  {copied ? <Check size={13} className="text-ok" /> : <Copy size={13} />}
                                  {copied ? "Copied" : "Copy UPI ID"}
                                </span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : null}

                    <ol className="mt-6 space-y-3">
                      {steps.map((s, i) => {
                        const isDone = i < idx;
                        const isActive = i === idx;
                        return (
                          <li key={s.key} className="flex items-center gap-3 text-[13px]">
                            <span
                              className={`grid size-6 place-items-center rounded-full border transition-colors duration-500 ${
                                isDone ? "border-ok bg-ok/15 text-ok" : isActive ? "border-neon text-neon" : "border-white/10 text-transparent"
                              }`}
                            >
                              {isDone ? <Check size={12} /> : isActive ? <Loader2 size={12} className="animate-spin" /> : null}
                            </span>
                            <span className={isDone || isActive ? "text-paper" : "text-dim"}>{s.label}</span>
                          </li>
                        );
                      })}
                    </ol>

                    {status === "awaiting" && (
                      <div className="mt-6 rounded-2xl border border-warn/25 bg-warn/[0.05] p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-semibold tracking-[0.18em] text-warn uppercase">Test mode</span>
                          <span className="text-[11px] text-dim">No real money moves</span>
                        </div>
                        <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                          <button onClick={complete} className="btn btn-primary btn-sm">
                            Complete test payment
                          </button>
                          <button onClick={fail} className="btn btn-ghost btn-sm">
                            Expire
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-center gap-2 border-t border-white/[0.06] py-4 text-[11px] text-dim">
              <Lock size={11} /> Secured by
              <Image src="/brand/payxa-wordmark.png" alt="PayXa" width={59} height={12} className="h-3 w-auto" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

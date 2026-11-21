"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import CheckoutModal from "./CheckoutModal";

export type PayStatus = "idle" | "awaiting" | "detected" | "verifying" | "verified" | "failed" | "expired";

export type CheckoutOrder = {
  id: string;
  amount: number; // paise
  item: string;
  merchant: string;
};

export type PayEvent = { at: number; type: string; text: string; tone: "muted" | "neon" | "warn" | "ok" | "bad" };

type Ctx = {
  open: boolean;
  status: PayStatus;
  order: CheckoutOrder | null;
  events: PayEvent[];
  startedAt: number;
  openCheckout: (o?: Partial<CheckoutOrder>) => void;
  close: () => void;
  complete: () => void;
  fail: () => void;
  retry: () => void;
};

const CheckoutCtx = createContext<Ctx | null>(null);

export function useCheckout() {
  const c = useContext(CheckoutCtx);
  if (!c) throw new Error("useCheckout must be used inside CheckoutProvider");
  return c;
}

export const formatINR = (paise: number) =>
  `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

let seq = 20480;

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<PayStatus>("idle");
  const [order, setOrder] = useState<CheckoutOrder | null>(null);
  const [events, setEvents] = useState<PayEvent[]>([]);
  const [startedAt, setStartedAt] = useState(0);
  const timers = useRef<number[]>([]);
  const t0 = useRef(0);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => clear, []);

  const push = useCallback((type: string, text: string, tone: PayEvent["tone"]) => {
    setEvents((e) => [...e, { at: Date.now() - t0.current, type, text, tone }]);
  }, []);

  const begin = useCallback(
    (o: CheckoutOrder) => {
      clear();
      t0.current = Date.now();
      setStartedAt(Date.now());
      setOrder(o);
      setEvents([]);
      setStatus("awaiting");
      setOpen(true);
      push("request", `POST /v1/checkout-sessions → 201 · ${o.id}`, "muted");
      timers.current.push(
        window.setTimeout(() => push("checkout.started", `checkout.started → push sent to 2 merchant devices`, "neon"), 450),
      );
    },
    [push],
  );

  const openCheckout = useCallback(
    (o?: Partial<CheckoutOrder>) => {
      seq += 1;
      begin({
        id: `PXA-${seq}`,
        amount: o?.amount ?? 49900,
        item: o?.item ?? "Website Strategy Call · 30 min",
        merchant: o?.merchant ?? "CodeXa Agency",
      });
    },
    [begin],
  );

  const complete = useCallback(() => {
    if (!order) return;
    clear();
    const amt = order.amount;
    push("customer", "Customer approved payment in UPI app", "muted");
    timers.current.push(
      window.setTimeout(() => {
        setStatus("detected");
        push("payment.detected", `payment.detected · ${amt} paise · unique match ${order.id}`, "warn");
      }, 1100),
      window.setTimeout(() => {
        setStatus("verifying");
        push("payment.verifying", "payment.verifying · awaiting trusted confirmation", "warn");
      }, 2000),
      window.setTimeout(() => {
        setStatus("verified");
        push("payment.verified", "payment.verified · source BANK_PSP", "ok");
      }, 3400),
      window.setTimeout(() => push("webhook", "POST merchant /webhooks/payxa → 200 (signed)", "ok"), 3900),
    );
  }, [order, push]);

  const fail = useCallback(() => {
    clear();
    setStatus("expired");
    push("checkout.expired", "checkout.expired · no verified payment received", "bad");
  }, [push]);

  const retry = useCallback(() => {
    if (order) openCheckout({ amount: order.amount, item: order.item, merchant: order.merchant });
  }, [order, openCheckout]);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <CheckoutCtx.Provider value={{ open, status, order, events, startedAt, openCheckout, close, complete, fail, retry }}>
      {children}
      <CheckoutModal />
    </CheckoutCtx.Provider>
  );
}

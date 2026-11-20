"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import {
  Activity,
  ArrowRight,
  BellRing,
  Home,
  List,
  Radar,
  Settings,
  ShieldCheck,
  Smartphone,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { PhoneFrame, SectionHeader, StatusBar } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";

type Screen = "home" | "live" | "tx" | "devices" | "alerts" | "settings";

const tabs: { id: Screen; icon: LucideIcon; label: string }[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "live", icon: Activity, label: "Live" },
  { id: "tx", icon: List, label: "Txns" },
  { id: "devices", icon: Smartphone, label: "Devices" },
  { id: "alerts", icon: BellRing, label: "Alerts" },
  { id: "settings", icon: Settings, label: "Settings" },
];

const alertTypes: { id: Screen; icon: LucideIcon; title: string; tone: string; body: string }[] = [
  {
    id: "live",
    icon: BellRing,
    title: "Payment Started",
    tone: "text-neon",
    body: "Sent once per new checkout session the moment it is created. Tap it to open that exact order. Repeat sessions never spam you.",
  },
  {
    id: "tx",
    icon: Radar,
    title: "Credit Detected",
    tone: "text-warn",
    body: "With your separate permission, the app reads only supported payment alerts, extracts allowed fields and syncs them encrypted. This is evidence, not final success.",
  },
  {
    id: "home",
    icon: ShieldCheck,
    title: "Payment Verified",
    tone: "text-ok",
    body: "Shown only after a trusted bank or PSP source confirms the payment. Website, app and dashboard all show the same server-authoritative status.",
  },
  {
    id: "alerts",
    icon: TriangleAlert,
    title: "Needs Review",
    tone: "text-warn",
    body: "Same-amount conflicts, late payments after expiry and unmatched credits are flagged for you instead of being guessed.",
  },
];

function Row({ a, b, c, tone = "text-paper" }: { a: string; b: string; c: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5 text-[11px]">
      <div>
        <div className="font-semibold text-paper">{a}</div>
        <div className="font-mono text-[9px] text-dim">{b}</div>
      </div>
      <div className={`text-right font-semibold ${tone}`}>{c}</div>
    </div>
  );
}

function ScreenBody({ s }: { s: Screen }) {
  switch (s) {
    case "home":
      return (
        <div className="space-y-3">
          <div className="rounded-2xl bg-gradient-to-br from-crimson to-crimson-deep p-4">
            <div className="text-[10px] text-white/70">Verified today</div>
            <div className="font-display text-2xl font-semibold">₹24,950</div>
            <div className="mt-2 flex gap-3 text-[10px] text-white/80">
              <span>82 payments</span>
              <span>7 active</span>
            </div>
          </div>
          <Row a="PXA-20480" b="Verified · 2m ago" c="₹1,299" tone="text-ok" />
          <Row a="PXA-20479" b="Detected · 4m ago" c="₹799" tone="text-warn" />
          <Row a="PXA-20478" b="Verified · 9m ago" c="₹349" tone="text-ok" />
        </div>
      );
    case "live":
      return (
        <div className="space-y-2.5">
          <div className="text-[11px] text-muted">Active checkouts · 3</div>
          {[
            ["PXA-20481", "₹499", "04:12"],
            ["PXA-20483", "₹2,100", "03:40"],
            ["PXA-20484", "₹150", "01:05"],
          ].map(([id, a, t]) => (
            <div key={id} className="rounded-xl border border-crimson/30 bg-crimson/[0.06] p-3 text-[11px]">
              <div className="flex justify-between">
                <span className="font-mono text-dim">{id}</span>
                <span className="font-mono text-neon">{t}</span>
              </div>
              <div className="mt-1 text-base font-semibold">{a}</div>
              <div className="text-[10px] text-muted">Awaiting customer payment</div>
            </div>
          ))}
        </div>
      );
    case "tx":
      return (
        <div className="space-y-2">
          <div className="flex gap-1.5 text-[9px]">
            {["All", "Detected", "Verified", "Review"].map((f, i) => (
              <span key={f} className={`rounded-full px-2 py-1 ${i === 0 ? "bg-crimson text-white" : "bg-white/[0.05] text-muted"}`}>
                {f}
              </span>
            ))}
          </div>
          <Row a="₹1,299.00" b="PXA-20480 · UPI" c="Verified" tone="text-ok" />
          <Row a="₹799.00" b="PXA-20479 · UPI" c="Detected" tone="text-warn" />
          <Row a="₹499.00" b="PXA-20470 · UPI" c="Review" tone="text-warn" />
          <Row a="₹349.00" b="PXA-20478 · UPI" c="Verified" tone="text-ok" />
        </div>
      );
    case "devices":
      return (
        <div className="space-y-2.5">
          {[
            ["Counter phone", "Online · synced 3s ago", "text-ok"],
            ["Owner phone", "Online · synced 1m ago", "text-ok"],
            ["Backup phone", "Offline · queue 2 events", "text-warn"],
          ].map(([n, s, c]) => (
            <div key={n} className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
              <Smartphone size={16} className={c} />
              <div className="text-[11px]">
                <div className="font-semibold">{n}</div>
                <div className={`text-[10px] ${c}`}>{s}</div>
              </div>
            </div>
          ))}
          <div className="rounded-xl border border-white/10 p-3 text-[10px] text-muted">
            Notification access: <span className="text-ok">granted</span>
            <br />
            Push token: <span className="text-ok">valid</span>
          </div>
        </div>
      );
    case "alerts":
      return (
        <div className="space-y-2">
          <Row a="Payment Started" b="PXA-20481 · now" c="₹499" tone="text-neon" />
          <Row a="Needs Review" b="Two ₹499 orders open" c="Action" tone="text-warn" />
          <Row a="Payment Verified" b="PXA-20480 · 2m" c="₹1,299" tone="text-ok" />
          <Row a="Late payment" b="PXA-20462 · expired" c="Review" tone="text-warn" />
        </div>
      );
    default:
      return (
        <div className="space-y-2">
          {[
            ["Payment Started sound", true],
            ["Verified alerts", true],
            ["Detected alerts", false],
            ["Biometric lock", true],
            ["Share diagnostics", false],
          ].map(([l, on]) => (
            <div key={l as string} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5 text-[11px]">
              {l as string}
              <span className={`flex h-4 w-7 items-center rounded-full p-0.5 ${on ? "justify-end bg-crimson" : "bg-white/15"}`}>
                <span className="size-3 rounded-full bg-white" />
              </span>
            </div>
          ))}
        </div>
      );
  }
}

const scrollSteps: { screen: Screen; alert: number; note?: string }[] = [
  { screen: "live", alert: 0 },
  { screen: "tx", alert: 1 },
  { screen: "home", alert: 2 },
  { screen: "alerts", alert: 3 },
  { screen: "devices", alert: -1, note: "Devices. See every paired phone, its sync status and its offline queue at a glance." },
  { screen: "settings", alert: -1, note: "Settings. Choose sounds and alert types, lock the app with biometrics and control diagnostics." },
];

export default function AppPreview() {
  const [screen, setScreen] = useState<Screen>("live");
  const [alert, setAlert] = useState(0);
  const [step, setStep] = useState(0);
  const [pinned, setPinned] = useState(false);
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (min-height: 760px)");
    const on = () => setPinned(mq.matches && !reduce);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [reduce]);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const phoneRotY = useTransform(scrollYProgress, [0, 1], [-28, 28]);
  const phoneRotX = useTransform(scrollYProgress, [0, 0.5, 1], [12, 0, 12]);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!pinned) return;
    const i = Math.min(scrollSteps.length - 1, Math.floor(v * scrollSteps.length));
    if (i !== step) {
      setStep(i);
      setScreen(scrollSteps[i].screen);
      if (scrollSteps[i].alert >= 0) setAlert(scrollSteps[i].alert);
    }
  });
  const note = pinned ? scrollSteps[step].note : undefined;
  const activeAlert = pinned && scrollSteps[step].alert < 0 ? -1 : alert;

  return (
    <section ref={wrap} className={`relative ${pinned ? "h-[520vh]" : "section-y overflow-hidden"}`}>
      <div className={pinned ? "sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-[var(--nav-h)]" : ""}>
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-crimson/10" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-[980px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-crimson/[0.06]" />
      <div className="container-px relative w-full">
        <SectionHeader
          index="08"
          eyebrow="PayXa Merchant · Android"
          title={pinned ? "Your counter, in your pocket." : "Your counter,\nin your pocket."}
          accentWords={["pocket."]}
          align="center"
          description={pinned ? undefined : "Pick an alert type to see how the app handles it. Tap the bottom bar to explore each screen."}
        />

        <div className={`${pinned ? "mt-8" : "mt-16"} grid grid-cols-1 [&>*]:min-w-0 items-center gap-12 lg:grid-cols-[1fr_auto_1fr]`}>
          <div className="order-2 space-y-3 lg:order-1">
            {alertTypes.slice(0, 2).map((a, i) => (
              <AlertButton key={a.title} a={a} active={activeAlert === i} onClick={() => { setAlert(i); setScreen(a.id); }} />
            ))}
          </div>

          <Reveal className="order-1 lg:order-2">
            <motion.div style={pinned ? { rotateY: phoneRotY, rotateX: phoneRotX, transformPerspective: 1200 } : undefined} className={pinned ? "" : "animate-float"}>
              <PhoneFrame className={pinned ? "w-[min(250px,26svh)]" : "w-[290px]"}>
                <div className="flex h-full flex-col">
                  <StatusBar />
                  <div className="flex items-center justify-between px-5 pt-5 pb-3">
                    <div>
                      <div className="font-mono text-[9px] tracking-[0.2em] text-dim uppercase">PayXa Merchant</div>
                      <div className="font-display text-[15px] font-semibold uppercase">
                        {tabs.find((t) => t.id === screen)?.label === "Txns"
                          ? "Transactions"
                          : tabs.find((t) => t.id === screen)?.label}
                      </div>
                    </div>
                    <span className="pulse-dot" />
                  </div>
                  <div className="relative flex-1 overflow-hidden px-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={screen}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <ScreenBody s={screen} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <nav className="grid grid-cols-6 border-t border-white/[0.06] bg-black/60 px-1 pt-2 pb-4 backdrop-blur">
                    {tabs.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setScreen(t.id)}
                        aria-label={t.label}
                        aria-pressed={screen === t.id}
                        className={`flex flex-col items-center gap-1 text-[8px] transition-colors ${screen === t.id ? "text-neon" : "text-dim hover:text-muted"}`}
                      >
                        <t.icon size={15} />
                        {t.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </PhoneFrame>
            </motion.div>
          </Reveal>

          <div className="order-3 space-y-3">
            {alertTypes.slice(2).map((a, i) => (
              <AlertButton key={a.title} a={a} active={activeAlert === i + 2} onClick={() => { setAlert(i + 2); setScreen(a.id); }} />
            ))}
          </div>
        </div>

        <Reveal>
          <div className={`mx-auto max-w-2xl text-center ${pinned ? "mt-8" : "mt-14"}`}>
            <AnimatePresence mode="wait">
              <motion.p
                key={note ?? alert}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-[15px] leading-relaxed text-muted"
              >
                {note ? (
                  note
                ) : (
                  <>
                    <span className={`font-semibold ${alertTypes[alert].tone}`}>{alertTypes[alert].title}. </span>
                    {alertTypes[alert].body}
                  </>
                )}
              </motion.p>
            </AnimatePresence>
            {pinned ? (
              <div className="mx-auto mt-6 flex max-w-xs gap-1.5">
                {scrollSteps.map((s, i) => (
                  <span key={s.screen} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= step ? "bg-crimson shadow-[0_0_8px_#ff4265]" : "bg-white/10"}`} />
                ))}
              </div>
            ) : (
              <Link href="/download" className="btn btn-primary mt-8">
                Get the merchant app <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </Reveal>
      </div>
      </div>
    </section>
  );
}

function AlertButton({
  a,
  active,
  onClick,
}: {
  a: (typeof alertTypes)[number];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Reveal>
      <button
        onClick={onClick}
        aria-pressed={active}
        className={`group w-full rounded-2xl border p-5 text-left transition-all duration-500 ${
          active ? "border-crimson/50 bg-crimson/[0.07] shadow-[0_20px_60px_-30px_rgba(217,4,41,0.9)]" : "border-white/[0.06] bg-surface/50 hover:border-white/15"
        }`}
      >
        <div className={`flex items-center gap-2 text-[14px] font-semibold ${a.tone}`}>
          <a.icon size={16} /> {a.title}
        </div>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">{a.body}</p>
      </button>
    </Reveal>
  );
}

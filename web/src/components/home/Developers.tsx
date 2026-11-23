"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BookOpen, Braces, Check, Copy, FlaskConical, Play, Webhook } from "lucide-react";
import { SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import ScrollTilt from "@/components/fx/ScrollTilt";
import { useCheckout } from "@/components/checkout/CheckoutProvider";
import { EventStream } from "@/components/checkout/MerchantPhone";
import { endpoints, highlight, snippets } from "@/lib/code";

export function CodeWindow({ className = "" }: { className?: string }) {
  const [tab, setTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const { openCheckout } = useCheckout();
  const s = snippets[tab];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(s.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <div className={`card overflow-hidden shadow-[0_40px_120px_-40px_rgba(217,4,41,0.25)] ${className}`}>
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
        <span className="size-2.5 rounded-full bg-crimson" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="ml-3 font-mono text-[11px] text-dim">{s.file}</span>
        <button
          onClick={() => openCheckout()}
          className="ml-auto flex items-center gap-1.5 rounded-md bg-crimson px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.14em] text-white uppercase shadow-[0_0_14px_rgba(255,66,101,0.25)] transition-transform hover:scale-105"
        >
          <Play size={11} /> Run
        </button>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10px] tracking-[0.14em] text-muted uppercase transition-colors hover:bg-white/5 hover:text-paper"
        >
          {copied ? <Check size={12} className="text-ok" /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-white/[0.06] px-2" data-lenis-prevent>
        {snippets.map((x, i) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={tab === i}
            onClick={() => setTab(i)}
            className={`relative shrink-0 px-3.5 py-3 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors ${
              tab === i ? "text-paper" : "text-dim hover:text-muted"
            }`}
          >
            {x.label}
            {tab === i && <motion.span layoutId="code-tab" className="absolute inset-x-2 bottom-0 h-[2px] bg-crimson shadow-[0_0_10px_rgba(255,66,101,0.3)]" />}
          </button>
        ))}
      </div>
      <div className="relative h-[420px] overflow-auto" data-lenis-prevent>
        <AnimatePresence mode="wait">
          <motion.pre
            key={s.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="p-5 font-mono text-[12.5px] leading-[1.75] text-paper/90"
          >
            <code>
              {s.code.split("\n").map((line, i) => (
                <div key={i} className="table-row">
                  <span className="table-cell pr-5 text-right text-dim/60 select-none">{i + 1}</span>
                  <span className="table-cell whitespace-pre">{highlight(line)}</span>
                </div>
              ))}
            </code>
          </motion.pre>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Developers() {
  return (
    <section className="section-y relative overflow-hidden">
      <div className="pointer-events-none absolute -left-40 top-1/3 size-[500px] rounded-full bg-crimson/10 blur-[120px]" />
      <div className="container-px relative grid grid-cols-1 [&>*]:min-w-0 gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <SectionHeader
            index="09"
            eyebrow="For developers"
            title={"Ship checkout\nin an afternoon."}
            accentWords={["afternoon."]}
            description="REST API, a drop-in checkout script, signed webhooks and realtime events. Amounts in paise, idempotent writes, and a sandbox that mirrors live."
          />
          <Reveal delay={0.1}>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:max-w-md">
              {[
                { href: "/docs", icon: BookOpen, label: "Read docs" },
                { href: "/developers#sandbox", icon: FlaskConical, label: "Try sandbox" },
                { href: "/developers#api", icon: Braces, label: "View API" },
                { href: "/developers#webhooks", icon: Webhook, label: "Test webhook" },
              ].map((a, i) => (
                <Link key={a.label} href={a.href} className={`btn ${i === 0 ? "btn-primary" : "btn-ghost"} justify-start`}>
                  <a.icon size={15} /> {a.label}
                </Link>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="mt-10 divide-y divide-white/[0.06] border-y border-white/[0.06] font-mono text-[12px]">
              {endpoints.slice(0, 5).map(([m, p]) => (
                <li key={p} className="flex items-center gap-4 py-2.5">
                  <span className={`w-11 font-semibold ${m === "POST" ? "text-neon" : "text-ok"}`}>{m}</span>
                  <span className="text-paper/90">{p}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 font-mono text-[10px] tracking-[0.12em] text-dim uppercase">
              REST API v1 · api.payxa.in
            </p>
          </Reveal>
        </div>
        <ScrollTilt>
          <CodeWindow />
          <EventStream className="mt-4" title="Script output" />
        </ScrollTilt>
      </div>
    </section>
  );
}

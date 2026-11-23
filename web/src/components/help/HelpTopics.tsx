"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BellRing, Code2, CreditCard, Search, Smartphone, UserCog, Wallet } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";
import { SpotlightCard } from "@/components/fx/Interactive";

const topics = [
  { icon: UserCog, t: "Account & onboarding", d: "Sign-up, email codes, verification, receiving UPI setup", href: "/docs#quickstart", k: "login register signup email otp code account verify kyc" },
  { icon: Smartphone, t: "Merchant app", d: "Pairing, permissions, diagnostics", href: "/download", k: "android app install pair device phone" },
  { icon: BellRing, t: "Alerts not arriving", d: "Battery optimisation, tokens, offline", href: "/docs#devices", k: "notification push alert sound battery offline" },
  { icon: Wallet, t: "Payments & review", d: "Detected vs verified, late, duplicates", href: "/how-it-works", k: "payment verified pending duplicate late upi" },
  { icon: Code2, t: "Integrations", d: "API keys, webhooks, test mode", href: "/developers", k: "api key webhook sdk developer integration test" },
  { icon: CreditCard, t: "Fees & refunds", d: "What PayXa charges and does not", href: "/pricing", k: "fee price cost refund charge gst tax" },
];

/** Help topics with instant search. Falls back to contacting support when nothing matches. */
export default function HelpTopics() {
  const [q, setQ] = useState("");
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return topics;
    return topics.filter((x) => `${x.t} ${x.d} ${x.k}`.toLowerCase().includes(s));
  }, [q]);

  return (
    <>
      <div className="mt-10 flex max-w-xl items-center gap-3 rounded-full border border-white/10 bg-surface/70 px-5 py-3.5 focus-within:border-neon">
        <Search size={18} className="text-dim" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search help topics"
          className="w-full bg-transparent text-[15px] outline-none placeholder:text-dim"
          aria-label="Search help"
        />
      </div>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((x, i) => (
          <Reveal key={x.t} delay={(i % 3) * 0.06}>
            <Link href={x.href} className="block h-full">
              <SpotlightCard className="h-full p-7">
                <x.icon size={20} className="text-neon" />
                <div className="mt-6 font-display text-[15px] font-semibold uppercase">{x.t}</div>
                <p className="mt-2 text-[14px] text-muted">{x.d}</p>
              </SpotlightCard>
            </Link>
          </Reveal>
        ))}
        {shown.length === 0 && (
          <div className="card col-span-full p-7 text-[14px] text-muted">
            No topic matches &ldquo;{q}&rdquo;.{" "}
            <Link href="/contact" className="font-semibold text-neon hover:underline">
              Contact support
            </Link>{" "}
            and we&apos;ll help directly.
          </div>
        )}
      </div>
    </>
  );
}

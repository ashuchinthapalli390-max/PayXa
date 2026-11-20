import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, LifeBuoy, MessageSquare, Scale } from "lucide-react";
import { Empty, PageHeader, Panel } from "@/components/dashboard/ui";

export const metadata: Metadata = { title: "Support" };

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader title="Support" subtitle="Tickets, disputes and help for your workspace." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: BookOpen, t: "Docs", d: "Integration guides and API reference", href: "/docs" },
          { icon: LifeBuoy, t: "Help center", d: "Device, alerts and payment questions", href: "/help" },
          { icon: MessageSquare, t: "Contact", d: "Talk to the PayXa team", href: "/contact" },
        ].map((c) => (
          <Link key={c.t} href={c.href} className="group rounded-2xl border border-white/[0.06] bg-[#0f0e12] p-5 transition-colors hover:border-crimson/40">
            <c.icon size={20} className="text-neon" />
            <div className="mt-4 text-[14px] font-semibold">{c.t}</div>
            <p className="mt-1 text-[13px] text-muted">{c.d}</p>
          </Link>
        ))}
      </div>
      <Panel title="Your tickets" className="mt-6">
        <Empty icon={Scale} title="No open tickets or disputes" body="Tickets you raise and disputes on your payments will appear here with their full history." />
      </Panel>
    </div>
  );
}

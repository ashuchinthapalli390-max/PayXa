import type { Metadata } from "next";
import { BadgeCheck, Building2, Clock, Landmark, Lock, ShieldCheck } from "lucide-react";
import { getSession } from "@/auth";
import { PageHeader, Panel, Pill } from "@/components/dashboard/ui";
import { Toggle } from "@/components/dashboard/Interactive";
import { Avatar } from "@/components/dashboard/Shell";
import { signOutAction } from "@/app/(auth)/actions";

export const metadata: Metadata = { title: "Settings" };

const verification = [
  { t: "Email verified", s: "done" },
  { t: "Business details", s: "done" },
  { t: "Receiving UPI ownership", s: "done" },
  { t: "Device diagnostics", s: "done" },
  { t: "Partner & compliance review", s: "pending" },
];

export default async function SettingsPage() {
  const session = await getSession();
  const user = session?.user ?? {};
  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader title="Settings" subtitle="Business profile, receiving account, security and verification." />
      <div className="space-y-6">
        <Panel title="Profile">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar user={user} size={56} />
            <div className="flex-1">
              <div className="text-[16px] font-semibold">{user.name ?? "Merchant"}</div>
              <div className="text-[13px] text-muted">{user.email}</div>
              <div className="mt-2">
                <Pill tone="info">Signed in with {session?.user?.email?.endsWith("@test.payxa") ? "test merchant" : "Google"}</Pill>
              </div>
            </div>
            <form action={signOutAction}>
              <button type="submit" className="inline-flex h-9 items-center rounded-xl border border-crimson/40 px-3.5 text-[13px] text-neon hover:bg-crimson/10">
                Sign out
              </button>
            </form>
          </div>
        </Panel>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel title={<span className="flex items-center gap-2"><Building2 size={15} className="text-dim" /> Business</span>}>
            <dl className="space-y-3 text-[13px]">
              {[
                ["Display name", "Aurora Store"],
                ["Category", "Electronics & accessories"],
                ["Website", "aurora.store"],
                ["Merchant ID", "merch_test_01"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-dim">{k}</dt>
                  <dd className="text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </Panel>
          <Panel title={<span className="flex items-center gap-2"><Landmark size={15} className="text-dim" /> Receiving UPI</span>}>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-4">
              <div>
                <div className="font-mono text-[13px]">aurorastore@payxatest</div>
                <div className="text-[12px] text-dim">Test receiving account</div>
              </div>
              <Pill tone="ok">
                <BadgeCheck size={12} /> Verified
              </Pill>
            </div>
            <p className="mt-3 text-[12px] text-dim">QR codes and checkouts only ever route to verified receiving accounts.</p>
          </Panel>
        </div>

        <Panel title={<span className="flex items-center gap-2"><ShieldCheck size={15} className="text-dim" /> Security</span>}>
          <ul className="divide-y divide-white/[0.05]">
            {[
              ["Two-factor sign-in", "Require a second step for every new device", true],
              ["Sign-in alerts", "Email me when a new browser signs in", true],
              ["Biometric lock on merchant app", "Ask for fingerprint or face to open PayXa Merchant", true],
              ["Share diagnostics", "Send anonymised app health data to improve alerts", false],
            ].map(([t, d, on]) => (
              <li key={t as string} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                <div>
                  <div className="text-[14px]">{t}</div>
                  <div className="text-[12px] text-dim">{d}</div>
                </div>
                <Toggle defaultOn={on as boolean} label={t as string} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Live access">
          <ol className="space-y-3">
            {verification.map((v) => (
              <li key={v.t} className="flex items-center gap-3 text-[14px]">
                {v.s === "done" ? <BadgeCheck size={18} className="text-ok" /> : <Clock size={18} className="text-warn" />}
                <span className="flex-1">{v.t}</span>
                <span className={`text-[12px] ${v.s === "done" ? "text-ok" : "text-warn"}`}>{v.s === "done" ? "Complete" : "In review"}</span>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-dashed border-white/15 p-4 text-[13px] text-muted">
            <Lock size={14} /> Live mode unlocks once the partner and compliance review is complete.
          </div>
        </Panel>
      </div>
    </div>
  );
}

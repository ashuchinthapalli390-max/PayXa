"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Eye, EyeOff, Link2, Plus, RefreshCw, Send, X } from "lucide-react";
import { RealQR, ScannerFrame } from "@/components/checkout/RealQR";
import { formatINR, linkList, type PaymentLink } from "@/lib/dashboard-data";
import { Pill, td, th } from "./ui";

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={title}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ y: 30, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#121015] shadow-[0_40px_120px_-30px_rgba(217,4,41,0.5)]"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <h2 className="text-[15px] font-semibold">{title}</h2>
              <button onClick={onClose} aria-label="Close" className="text-muted hover:text-paper">
                <X size={18} />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setOk(true);
          window.setTimeout(() => setOk(false), 1400);
        } catch {
          /* clipboard blocked */
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[12px] text-muted hover:bg-white/[0.05] hover:text-paper"
    >
      {ok ? <Check size={13} className="text-ok" /> : <Copy size={13} />}
      {ok ? "Copied" : label}
    </button>
  );
}

export function Toggle({ defaultOn = false, label, disabled = false }: { defaultOn?: boolean; label: string; disabled?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => setOn((v) => !v)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-40 ${on ? "bg-crimson" : "bg-white/15"}`}
    >
      <motion.span layout className={`absolute top-0.5 size-5 rounded-full bg-white shadow ${on ? "right-0.5" : "left-0.5"}`} />
    </button>
  );
}

const field =
  "mt-1.5 w-full rounded-xl border border-white/10 bg-ink px-3.5 py-2.5 text-[14px] text-paper outline-none placeholder:text-dim focus:border-neon focus:shadow-[0_0_0_3px_rgba(255,66,101,0.15)]";

export function LinksManager() {
  const [links, setLinks] = useState<PaymentLink[]>(linkList);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const create = () => {
    const rupees = Number(amount);
    if (!title.trim() || !rupees || rupees <= 0) return;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24) || "link";
    setLinks((l) => [
      { id: `plink_${slug}`, title: title.trim(), amount: Math.round(rupees * 100), url: `pay.payxa.example/l/${slug}`, status: "active", views: 0, started: 0, paid: 0, expires: "No expiry" },
      ...l,
    ]);
    setTitle("");
    setAmount("");
    setOpen(false);
  };
  const tone = { active: "ok", expired: "muted", archived: "muted" } as const;
  return (
    <>
      <div className="mb-4 flex justify-end">
        <button onClick={() => setOpen(true)} className="inline-flex h-9 items-center gap-2 rounded-xl bg-crimson px-3.5 text-[13px] font-medium text-white hover:bg-[#e8062f]">
          <Plus size={15} /> Create link
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-[#0f0e12]">
        <table className="w-full">
          <thead className="border-b border-white/[0.05]">
            <tr>
              <th className={th}>Link</th>
              <th className={`${th} text-right`}>Amount</th>
              <th className={th}>Status</th>
              <th className={`${th} text-right`}>Views → Started → Paid</th>
              <th className={th}>Expires</th>
              <th className={th} />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            <AnimatePresence initial={false}>
              {links.map((l) => (
                <motion.tr key={l.id} initial={{ opacity: 0, backgroundColor: "rgba(255,66,101,0.12)" }} animate={{ opacity: 1, backgroundColor: "rgba(255,66,101,0)" }} className="hover:bg-white/[0.02]">
                  <td className={td}>
                    <div className="font-medium">{l.title}</div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-dim">
                      <Link2 size={11} /> {l.url}
                    </div>
                  </td>
                  <td className={`${td} text-right font-semibold tabular-nums`}>{formatINR(l.amount)}</td>
                  <td className={td}>
                    <Pill tone={tone[l.status]}>{l.status[0].toUpperCase() + l.status.slice(1)}</Pill>
                  </td>
                  <td className={`${td} text-right font-mono text-[12px] text-muted`}>
                    {l.views} → {l.started} → <span className="text-ok">{l.paid}</span>
                  </td>
                  <td className={`${td} text-muted`}>{l.expires}</td>
                  <td className={`${td} text-right`}>
                    <CopyButton value={`https://${l.url}`} />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="New payment link">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            create();
          }}
          className="space-y-4"
        >
          <label className="block text-[13px] text-muted">
            What is it for?
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Workshop seat — Jan batch" className={field} required />
          </label>
          <label className="block text-[13px] text-muted">
            Amount (₹)
            <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} inputMode="decimal" placeholder="2500" className={field} required />
          </label>
          <p className="text-[12px] text-dim">Test-mode links open the PayXa test checkout. No real money moves.</p>
          <button type="submit" className="flex h-11 w-full items-center justify-center rounded-xl bg-crimson text-[14px] font-semibold text-white hover:bg-[#e8062f]">
            Create link
          </button>
        </form>
      </Modal>
    </>
  );
}

export function PairDevice() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex h-9 items-center gap-2 rounded-xl bg-crimson px-3.5 text-[13px] font-medium text-white hover:bg-[#e8062f]">
        <Plus size={15} /> Pair device
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Pair a merchant phone">
        <div className="text-center">
          <ScannerFrame className="mx-auto w-[200px]">
            <RealQR />
          </ScannerFrame>
          <ol className="mt-8 space-y-2 text-left text-[13px] text-muted">
            <li>1. Open <span className="text-paper">PayXa Merchant</span> on the phone.</li>
            <li>2. Tap <span className="text-paper">Pair with dashboard</span> and scan this code.</li>
            <li>3. Allow push alerts. Notification access is optional.</li>
          </ol>
          <div className="mt-5 rounded-xl bg-white/[0.03] px-3 py-2 font-mono text-[12px] text-muted">
            Or enter code <span className="tracking-[0.3em] text-paper">PX-48K2-91</span> · expires in 5 min
          </div>
        </div>
      </Modal>
    </>
  );
}

export function ApiKeys() {
  const [env, setEnv] = useState<"test" | "live">("test");
  const [reveal, setReveal] = useState(false);
  const [rotated, setRotated] = useState(0);
  const pk = `pxa_test_pk_${(81273 + rotated * 911).toString(36)}9Xa2Lm`;
  const sk = `pxa_test_sk_${(55219 + rotated * 733).toString(36)}Qe7Rt0Vb4`;
  return (
    <div>
      <div className="mb-4 inline-flex rounded-xl border border-white/[0.08] p-1 text-[13px]">
        {(["test", "live"] as const).map((e) => (
          <button
            key={e}
            onClick={() => setEnv(e)}
            className={`rounded-lg px-4 py-1.5 capitalize transition-colors ${env === e ? (e === "test" ? "bg-warn/15 text-warn" : "bg-white/[0.07] text-paper") : "text-muted"}`}
          >
            {e} mode
          </button>
        ))}
      </div>
      {env === "live" ? (
        <div className="rounded-xl border border-dashed border-white/15 p-5 text-[13px] text-muted">
          Live keys are created after business verification, receiving-account checks and partner review.
        </div>
      ) : (
        <div className="space-y-3">
          {[
            { k: "Publishable key", v: pk, secret: false },
            { k: "Secret key", v: sk, secret: true },
          ].map((row) => (
            <div key={row.k} className="flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-ink/60 p-4 sm:flex-row sm:items-center">
              <div className="w-36 text-[13px] text-muted">{row.k}</div>
              <code className="flex-1 truncate font-mono text-[13px] text-paper">{row.secret && !reveal ? `pxa_test_sk_${"•".repeat(18)}` : row.v}</code>
              <div className="flex items-center gap-1">
                {row.secret && (
                  <button onClick={() => setReveal((v) => !v)} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[12px] text-muted hover:bg-white/[0.05] hover:text-paper">
                    {reveal ? <EyeOff size={13} /> : <Eye size={13} />} {reveal ? "Hide" : "Reveal"}
                  </button>
                )}
                <CopyButton value={row.v} />
              </div>
            </div>
          ))}
          <button onClick={() => setRotated((r) => r + 1)} className="inline-flex items-center gap-2 text-[13px] text-neon hover:underline">
            <RefreshCw size={13} /> Roll secret key
          </button>
        </div>
      )}
    </div>
  );
}

type Delivery = { id: string; event: string; order: string; code: number; ms: number; at: string };

export function WebhookTester({ initial }: { initial: Delivery[] }) {
  const [rows, setRows] = useState(initial);
  const [event, setEvent] = useState("payment.verified");
  const send = () => {
    setRows((r) => [{ id: `whd_${Date.now()}`, event, order: "PXA-TEST", code: 200, ms: 90 + Math.round(Math.random() * 80), at: new Date().toISOString() }, ...r].slice(0, 8));
  };
  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <code className="flex-1 truncate rounded-xl border border-white/[0.06] bg-ink/60 px-3.5 py-2.5 font-mono text-[12px] text-paper">https://aurora.store/webhooks/payxa</code>
        <select value={event} onChange={(e) => setEvent(e.target.value)} className="h-10 rounded-xl border border-white/[0.08] bg-[#0f0e12] px-3 font-mono text-[12px] text-paper" aria-label="Event to send">
          {["checkout.started", "payment.detected", "payment.verifying", "payment.verified", "payment.needs_review", "payment.late_detected", "device.offline"].map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
        <button onClick={send} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-crimson px-4 text-[13px] font-medium text-white hover:bg-[#e8062f]">
          <Send size={14} /> Send test event
        </button>
      </div>
      <ul className="mt-4 divide-y divide-white/[0.04] rounded-xl border border-white/[0.06]">
        <AnimatePresence initial={false}>
          {rows.map((w) => (
            <motion.li key={w.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-center gap-3 px-4 py-2.5 font-mono text-[12px]">
              <span className={`size-2 rounded-full ${w.code === 200 ? "bg-ok" : "bg-neon"}`} />
              <span className="flex-1 truncate">{w.event}</span>
              <span className="hidden text-dim sm:block">{w.order}</span>
              <span className={w.code === 200 ? "text-ok" : "text-neon"}>{w.code}</span>
              <span className="w-16 text-right text-dim">{w.ms}ms</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

import type { Metadata } from "next";
import { Download, Printer, QrCode } from "lucide-react";
import { PageHeader, Panel, Pill } from "@/components/dashboard/ui";
import { RealQR, ScannerFrame } from "@/components/checkout/RealQR";

export const metadata: Metadata = { title: "QR Payments" };

export default function QrPage() {
  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader title="QR Payments" subtitle="A counter QR for walk-in customers, plus per-order dynamic QR where supported." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Panel title="Counter QR · Aurora Store">
          <div className="mx-auto max-w-[300px] rounded-3xl bg-gradient-to-b from-crimson to-crimson-deep p-6 text-center shadow-[0_30px_80px_-30px_rgba(217,4,41,0.8)]">
            <div className="font-display text-lg font-bold tracking-wide text-white uppercase">Scan & pay</div>
            <div className="mb-4 text-[12px] text-white/75">Any UPI app · Aurora Store</div>
            <ScannerFrame>
              <RealQR />
            </ScannerFrame>
            <div className="mt-5 font-mono text-[11px] text-white/80">Powered by PayXa</div>
          </div>
          <div className="mt-6 flex justify-center gap-2">
            <button disabled className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 px-3.5 text-[13px] opacity-60" title="Print kits are available once live mode is on">
              <Printer size={14} /> Print standee
            </button>
            <button disabled className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 px-3.5 text-[13px] opacity-60" title="High-resolution export is available once live mode is on">
              <Download size={14} /> Download PNG
            </button>
          </div>
          <p className="mt-3 text-center text-[12px] text-dim">Test-mode QR codes never collect payments.</p>
        </Panel>
        <div className="space-y-6">
          <Panel title="How counter payments are matched">
            <ol className="space-y-3 text-[13px] text-muted">
              <li><span className="text-paper">1.</span> The customer scans and pays any amount from their UPI app.</li>
              <li><span className="text-paper">2.</span> Your paired phone detects the incoming credit alert.</li>
              <li><span className="text-paper">3.</span> With no open order, it lands in the unmatched queue for you to confirm.</li>
              <li><span className="text-paper">4.</span> Trusted confirmation marks it verified in the dashboard and app.</li>
            </ol>
          </Panel>
          <Panel title="Dynamic QR">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-crimson/10 text-neon">
                <QrCode size={20} />
              </span>
              <div>
                <div className="flex items-center gap-2 text-[14px] font-semibold">
                  Per-order QR <Pill tone="warn">Depends on partner</Pill>
                </div>
                <p className="mt-1 text-[13px] text-muted">
                  Each checkout session gets its own QR with the amount and reference embedded, where your UPI acceptance method supports it.
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

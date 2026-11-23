import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { footerNav } from "@/lib/site";
import { LogoMark, Wordmark } from "@/components/brand/Logo";
import { PoweredBy } from "@/components/brand/PoweredBy";

export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-white/[0.06]" data-scene="payxa" data-side="center">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/70 to-ink" />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,transparent,black_40%,black)]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[900px] -translate-x-1/2 rounded-full bg-crimson/10 blur-[120px]" />

      <div className="container-px relative pt-20 pb-10">
        <div className="grid grid-cols-1 [&>*]:min-w-0 gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark size={34} />
              <Wordmark height={22} />
            </div>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted">
              UPI-first checkout, instant merchant alerts and developer APIs. Built by CodeXa Agency in India.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="chip">
                <span className="pulse-dot" /> Accepting merchants
              </span>
              <span className="chip">A CodeXa Agency product</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {footerNav.map((col) => (
              <div key={col.title}>
                <h3 className="eyebrow mb-5 !text-paper">{col.title}</h3>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="group inline-flex items-center gap-1 text-[14px] text-muted transition-colors hover:text-paper"
                      >
                        {l.label}
                        <ArrowUpRight
                          size={12}
                          className="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Giant outline wordmark */}
        <div aria-hidden className="relative mt-20 select-none">
          <div className="display text-stroke text-center text-[22vw] leading-[0.8] tracking-[-0.04em] lg:text-[17vw]">
            PAY<span className="[-webkit-text-stroke:1px_rgba(255,66,101,0.35)]">X</span>A
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <PoweredBy size="lg" />
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/[0.06] pt-6 text-[12px] text-dim md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} PayXa · Powered by CodeXa Agency. PayXa is a payment technology platform; it does not hold
            or settle customer funds.
          </p>
          <p className="font-mono tracking-[0.14em] uppercase">Payments. Connected.</p>
        </div>
      </div>
    </footer>
  );
}

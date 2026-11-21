import Image from "next/image";

const CODEXA_URL = "https://codexa-agency.online";

/** "Powered by CodeXa Agency" credit, in two sizes. Links to the agency site. */
export function PoweredBy({ size = "sm", className = "" }: { size?: "sm" | "lg"; className?: string }) {
  if (size === "lg")
    return (
      <a
        href={CODEXA_URL}
        target="_blank"
        rel="noopener"
        className={`group inline-flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] py-3 pr-6 pl-3 transition-colors hover:border-crimson/50 ${className}`}
      >
        <Image
          src="/brand/codexa-mark.png"
          alt="CodeXa Agency"
          width={52}
          height={52}
          className="size-[52px] rounded-xl ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-105"
        />
        <span className="text-left">
          <span className="block font-mono text-[10px] tracking-[0.24em] text-dim uppercase">Powered by</span>
          <span className="block font-display text-[15px] font-semibold tracking-tight text-paper">
            CODE<span className="text-neon">XA</span> Agency
          </span>
          <span className="block font-mono text-[10px] text-dim">codexa-agency.online</span>
        </span>
      </a>
    );
  return (
    <a
      href={CODEXA_URL}
      target="_blank"
      rel="noopener"
      className={`inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] text-dim uppercase transition-colors hover:text-paper ${className}`}
    >
      <Image src="/brand/codexa-mark.png" alt="" width={18} height={18} className="size-[18px] rounded" />
      Powered by <span className="font-semibold text-paper">CODE<span className="text-neon">XA</span> Agency</span>
    </a>
  );
}

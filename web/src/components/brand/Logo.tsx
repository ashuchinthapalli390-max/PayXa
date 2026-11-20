import Image from "next/image";
import Link from "next/link";

export function LogoMark({ size = 34, className = "" }: { size?: number; className?: string }) {
  // payxa-mark.png is 570x295
  return (
    <Image
      src="/brand/payxa-mark.png"
      alt=""
      width={Math.round(size * (570 / 295))}
      height={size}
      className={className}
      priority
    />
  );
}

export function Wordmark({ height = 18, className = "" }: { height?: number; className?: string }) {
  // payxa-wordmark.png is 690x140
  return (
    <Image
      src="/brand/payxa-wordmark.png"
      alt="PayXa"
      width={Math.round(height * (690 / 140))}
      height={height}
      className={className}
      priority
    />
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="PayXa home" className={`group flex items-center gap-2.5 ${className}`}>
      <LogoMark size={26} className="transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105" />
      <Wordmark height={17} />
    </Link>
  );
}

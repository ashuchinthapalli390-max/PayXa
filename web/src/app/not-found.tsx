import Link from "next/link";

export default function NotFound() {
  return (
    <section data-scene="tunnel" data-side="center" className="relative grid min-h-[100svh] place-items-center overflow-hidden px-4 text-center">
      <div className="relative">
        <div className="display text-gradient-red text-[clamp(100px,22vw,260px)]">404</div>
        <p className="mt-2 font-mono text-[12px] tracking-[0.2em] text-muted uppercase">This route is not on the network</p>
        <Link href="/" className="btn btn-primary mt-10">
          Back to home
        </Link>
      </div>
    </section>
  );
}

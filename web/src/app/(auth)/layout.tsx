import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SceneLayer from "@/components/three/SceneLayer";
import { Logo } from "@/components/brand/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SceneLayer />
      <header className="fixed inset-x-0 top-0 z-40">
        <div className="container-px flex h-[var(--nav-h)] items-center justify-between">
          <Logo />
          <Link href="/" className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-muted uppercase transition-colors hover:text-paper">
            <ArrowLeft size={14} /> Back to site
          </Link>
        </div>
      </header>
      <main id="main" className="relative z-10">
        {children}
      </main>
    </>
  );
}

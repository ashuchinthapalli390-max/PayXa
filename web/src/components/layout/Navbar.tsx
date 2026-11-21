"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { mainNav } from "@/lib/site";
import { getLenis } from "@/components/fx/SmoothScroll";

const ease = [0.76, 0, 0.24, 1] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [user, setUser] = useState<{ name?: string | null; image?: string | null } | null>(null);

  // Public pages stay static; the signed-in state is fetched on the client.
  useEffect(() => {
    let alive = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => alive && setUser(s?.user ?? null))
      .catch(() => alive && setUser(null));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 400 && y > last + 4);
      if (y < last - 4) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropdown(false);
  }, [pathname]);

  useEffect(() => {
    const l = getLenis();
    if (open) {
      l?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      l?.start();
      document.documentElement.style.overflow = "";
    }
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${scrolled || open ? "border-b border-white/[0.06] bg-ink/70 backdrop-blur-xl" : "border-b border-transparent"}`}
      >
        <nav className="container-px flex h-[var(--nav-h)] items-center justify-between gap-6" aria-label="Main">
          <Logo />

          <ul className="hidden items-center gap-1 lg:flex">
            {mainNav.map((item) => (
              <li
                key={item.href}
                className="relative"
                onMouseEnter={() => item.children && setDropdown(true)}
                onMouseLeave={() => item.children && setDropdown(false)}
              >
                <Link
                  href={item.href}
                  className={`relative flex items-center gap-1 px-3.5 py-2 font-mono text-[11px] font-medium tracking-[0.2em] uppercase transition-colors ${
                    isActive(item.href) ? "text-paper" : "text-muted hover:text-paper"
                  }`}
                  aria-expanded={item.children ? dropdown : undefined}
                  onFocus={() => item.children && setDropdown(true)}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown size={12} className={`transition-transform ${dropdown ? "rotate-180" : ""}`} />
                  )}
                  {isActive(item.href) && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3.5 -bottom-[3px] h-px bg-crimson shadow-[0_0_10px_rgba(255,66,101,0.3)]"
                    />
                  )}
                </Link>

                {item.children && (
                  <AnimatePresence>
                    {dropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, clipPath: "inset(0 0 100% 0 round 18px)" }}
                        animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0 round 18px)" }}
                        exit={{ opacity: 0, y: 6, clipPath: "inset(0 0 100% 0 round 18px)" }}
                        transition={{ duration: 0.45, ease }}
                        className="absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3"
                      >
                        <div className="glass grid grid-cols-2 gap-1 rounded-[18px] p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
                          {item.children.map((c) => (
                            <Link
                              key={c.href}
                              href={c.href}
                              onBlur={(e) => {
                                if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) setDropdown(false);
                              }}
                              className="group rounded-xl p-4 transition-colors hover:bg-white/[0.04]"
                            >
                              <div className="flex items-center justify-between font-display text-[13px] font-semibold tracking-wide text-paper uppercase">
                                {c.label}
                                <ArrowUpRight
                                  size={14}
                                  className="text-crimson opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                                />
                              </div>
                              <p className="mt-1.5 text-[13px] leading-snug text-muted">{c.desc}</p>
                            </Link>
                          ))}
                          <Link
                            href="/products"
                            className="col-span-2 flex items-center justify-between rounded-xl border-t border-white/[0.06] px-4 py-3 font-mono text-[11px] tracking-[0.18em] text-muted uppercase hover:text-paper"
                          >
                            All products <ArrowUpRight size={14} />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {user ? (
              <Link href="/dashboard" className="hidden items-center gap-2.5 rounded-full border border-white/10 py-1 pr-4 pl-1 transition-colors hover:border-crimson/50 sm:flex">
                {user.image ? (
                  <Image src={user.image} alt="" width={28} height={28} className="size-7 rounded-full" />
                ) : (
                  <span className="grid size-7 place-items-center rounded-full bg-crimson font-display text-[10px] font-bold">
                    {(user.name ?? "M").slice(0, 1).toUpperCase()}
                  </span>
                )}
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase">Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden px-3 font-mono text-[11px] tracking-[0.2em] text-muted uppercase transition-colors hover:text-paper sm:block"
                >
                  Log in
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm hidden sm:inline-flex">
                  Get started
                </Link>
              </>
            )}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid size-10 place-items-center rounded-full border border-white/15 text-paper lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen menu with wipe */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-ink lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="grid-bg absolute inset-0 opacity-40" />
            <div className="container-px relative flex h-full flex-col pt-[calc(var(--nav-h)+24px)] pb-8">
              <ul className="flex flex-col">
                {[...mainNav, { label: "How it works", href: "/how-it-works" }, { label: "Security", href: "/security" }].map(
                  (item, i) => (
                    <li key={item.href} className="overflow-hidden border-b border-white/[0.06]">
                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center justify-between py-4 font-display text-2xl font-semibold uppercase"
                        >
                          <span className={isActive(item.href) ? "text-neon" : ""}>{item.label}</span>
                          <span className="font-mono text-[11px] text-dim">0{i + 1}</span>
                        </Link>
                      </motion.div>
                    </li>
                  ),
                )}
              </ul>
              {user ? (
                <Link href="/dashboard" className="btn btn-primary mt-auto">
                  Open dashboard
                </Link>
              ) : (
                <div className="mt-auto grid grid-cols-2 gap-3">
                  <Link href="/login" className="btn btn-ghost">
                    Log in
                  </Link>
                  <Link href="/register" className="btn btn-primary">
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

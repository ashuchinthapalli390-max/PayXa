"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bell,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  FlaskConical,
  Lock,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { LogoMark, Wordmark } from "@/components/brand/Logo";
import { dashNav } from "./nav";
import { signOutAction } from "@/app/(auth)/actions";

type User = { name?: string | null; email?: string | null; image?: string | null };

function initials(name?: string | null) {
  return (name ?? "M")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({ user, size = 32 }: { user: User; size?: number }) {
  if (user.image)
    return <Image src={user.image} alt="" width={size} height={size} className="rounded-full ring-2 ring-white/10" style={{ width: size, height: size }} />;
  return (
    <span
      className="grid place-items-center rounded-full bg-gradient-to-br from-crimson to-crimson-deep font-display text-[11px] font-bold text-white ring-2 ring-white/10"
      style={{ width: size, height: size }}
    >
      {initials(user.name)}
    </span>
  );
}

function SidebarNav({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = (href: string) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Dashboard">
      {dashNav.map((g) => (
        <div key={g.group} className="mb-5">
          {!collapsed && <div className="px-3 pb-2 font-mono text-[10px] tracking-[0.2em] text-dim uppercase">{g.group}</div>}
          <ul className="space-y-0.5">
            {g.items.map((it) => {
              const on = active(it.href);
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    onClick={onNavigate}
                    title={collapsed ? it.label : undefined}
                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] transition-colors ${
                      on ? "bg-white/[0.06] text-paper" : "text-muted hover:bg-white/[0.03] hover:text-paper"
                    } ${collapsed ? "justify-center" : ""}`}
                  >
                    {on && <motion.span layoutId="dash-active" className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-crimson shadow-[0_0_10px_#ff4265]" />}
                    <it.icon size={18} className={on ? "text-neon" : "text-dim group-hover:text-muted"} />
                    {!collapsed && <span className="flex-1">{it.label}</span>}
                    {!collapsed && it.badge && (
                      <span className="rounded-full bg-crimson/20 px-1.5 py-0.5 font-mono text-[10px] text-neon">{it.badge}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 rounded-full p-1 pr-3 transition-colors hover:bg-white/[0.05]" aria-expanded={open} aria-haspopup="menu">
        <Avatar user={user} />
        <span className="hidden max-w-[120px] truncate text-[13px] font-medium sm:block">{user.name ?? "Merchant"}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#121015] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
          >
            <div className="flex items-center gap-3 border-b border-white/[0.06] p-4">
              <Avatar user={user} size={40} />
              <div className="min-w-0">
                <div className="truncate text-[14px] font-semibold">{user.name ?? "Merchant"}</div>
                <div className="truncate text-[12px] text-muted">{user.email}</div>
              </div>
            </div>
            <div className="p-1.5 text-[13px]">
              <Link href="/dashboard/settings" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-muted hover:bg-white/[0.05] hover:text-paper" onClick={() => setOpen(false)}>
                <ShieldCheck size={15} /> Account & security
              </Link>
              <Link href="/" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-muted hover:bg-white/[0.05] hover:text-paper">
                <ExternalLink size={15} /> PayXa website
              </Link>
              <form action={signOutAction}>
                <button type="submit" className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-neon hover:bg-crimson/10">
                  <LogOut size={15} /> Sign out
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const notifications = [
  { t: "Payment verified", d: "₹1,299.00 · PXA-20480", tone: "bg-ok" },
  { t: "Needs review", d: "Two open ₹499 orders", tone: "bg-warn" },
  { t: "Backup phone offline", d: "2 events queued", tone: "bg-neon" },
];

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)} aria-label="Notifications" className="relative grid size-9 place-items-center rounded-full text-muted hover:bg-white/[0.05] hover:text-paper">
        <Bell size={18} />
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-neon shadow-[0_0_8px_#ff4265]" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#121015] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <span className="text-[13px] font-semibold">Notifications</span>
              <Link href="/dashboard/notifications" className="text-[12px] text-neon" onClick={() => setOpen(false)}>
                View all
              </Link>
            </div>
            {notifications.map((n) => (
              <div key={n.t} className="flex gap-3 border-b border-white/[0.04] px-4 py-3 last:border-0">
                <span className={`mt-1.5 size-2 shrink-0 rounded-full ${n.tone}`} />
                <div>
                  <div className="text-[13px] font-medium">{n.t}</div>
                  <div className="text-[12px] text-muted">{n.d}</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Shell({ user, children }: { user: User; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <div className="flex min-h-dvh bg-[#08070a]">
      {/* Desktop sidebar */}
      <aside
        className={`sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-white/[0.06] bg-ink transition-[width] duration-300 lg:flex ${collapsed ? "w-[76px]" : "w-[260px]"}`}
      >
        <div className={`flex h-16 items-center border-b border-white/[0.06] ${collapsed ? "justify-center" : "gap-2.5 px-5"}`}>
          <Link href="/dashboard" className="flex items-center gap-2.5" aria-label="PayXa dashboard">
            <LogoMark size={22} />
            {!collapsed && <Wordmark height={15} />}
          </Link>
        </div>
        {!collapsed && (
          <div className="mx-3 mt-4 rounded-xl border border-white/[0.06] bg-surface/60 p-3">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-paper font-display text-[12px] font-bold text-ink">A</span>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-semibold">Aurora Store</div>
                <div className="font-mono text-[10px] text-dim">merch_test_01</div>
              </div>
            </div>
          </div>
        )}
        <SidebarNav collapsed={collapsed} />
        <div className="border-t border-white/[0.06] p-3">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-[12px] text-dim hover:bg-white/[0.04] hover:text-paper"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
            {!collapsed && "Collapse"}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/70 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/[0.06] bg-ink lg:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
                <span className="flex items-center gap-2.5">
                  <LogoMark size={22} />
                  <Wordmark height={15} />
                </span>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="text-muted">
                  <X size={18} />
                </button>
              </div>
              <SidebarNav collapsed={false} onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-center gap-2 bg-warn/10 px-4 py-1.5 text-center font-mono text-[10px] font-semibold tracking-[0.18em] text-warn uppercase">
          <FlaskConical size={12} /> Test mode · Test data only, no real money moves
        </div>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/[0.06] bg-[#08070a]/85 px-4 backdrop-blur-xl sm:px-6">
          <button onClick={() => setMobileOpen(true)} className="grid size-9 place-items-center rounded-lg text-muted hover:text-paper lg:hidden" aria-label="Open menu">
            <Menu size={18} />
          </button>
          <label className="flex h-10 max-w-md flex-1 items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 text-muted focus-within:border-neon/60">
            <Search size={16} />
            <input placeholder="Search payments, orders, UTR…" className="w-full bg-transparent text-[14px] text-paper outline-none placeholder:text-dim" aria-label="Search" />
            <kbd className="hidden rounded border border-white/10 px-1.5 font-mono text-[10px] text-dim sm:block">⌘K</kbd>
          </label>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center rounded-full border border-white/[0.08] bg-white/[0.02] p-1 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase md:flex">
              <span className="rounded-full bg-warn/15 px-3 py-1.5 text-warn">Test</span>
              <span className="flex cursor-not-allowed items-center gap-1 px-3 py-1.5 text-dim" title="Live mode unlocks after business verification">
                <Lock size={10} /> Live
              </span>
            </div>
            <NotificationBell />
            <UserMenu user={user} />
          </div>
        </header>
        <main id="main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

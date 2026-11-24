import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Building2, Lock, PauseCircle, ShieldCheck, UserPlus } from "lucide-react";
import { getSession } from "@/auth";
import { adminEntry, dashboardUrl, isBlocked, merchantLanding, resolveAccess } from "@/lib/access";
import { signOutAction } from "@/app/(auth)/actions";

export const metadata: Metadata = { title: "Continue", robots: { index: false } };
export const dynamic = "force-dynamic";

const roleLabel: Record<string, string> = {
  OWNER: "Owner",
  ADMINISTRATOR: "Administrator",
  DEVELOPER: "Developer",
  FINANCE: "Finance",
  VIEWER: "Viewer",
  SUPER_ADMIN: "Super admin",
  OWNER_ADMIN: "Owner",
  PLATFORM_ADMIN: "Platform admin",
  ADMIN: "Admin",
  AUDITOR: "Auditor",
  SUPPORT: "Support",
};

/** Same-site dashboard path only (no scheme, no protocol-relative). */
function safeNext(v?: string) {
  return v && v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\") ? v : null;
}

/**
 * Role router: every login lands here. It verifies who the person is in the shared
 * PayXa database and sends them where their role and access allow.
 */
export default async function ContinuePage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const session = await getSession();
  const email = session?.user?.email;
  if (!email) redirect(`/login?callbackUrl=${encodeURIComponent(`/continue${next ? `?next=${encodeURIComponent(next)}` : ""}`)}`);

  const access = await resolveAccess(email);

  // Database unreachable: the dashboard runs its own membership check, so hand over safely.
  if (!access.resolved && !access.admin) redirect(dashboardUrl(safeNext(next) ?? "/"));

  const open = access.memberships.filter((m) => !isBlocked(m));
  const blocked = access.memberships.filter(isBlocked);
  const primary = open[0];
  const wanted = safeNext(next);

  // Access-based deep links: honoured only for people who can actually use the merchant dashboard.
  if (primary && wanted && !access.admin) redirect(dashboardUrl(wanted));

  // Exactly one place to go → go there.
  if (primary && !access.admin) redirect(dashboardUrl(merchantLanding(primary)));
  if (access.admin && !primary) redirect(adminEntry(access.admin));
  if (!access.admin && !primary && !blocked.length) redirect(dashboardUrl("/no-workspace"));

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <section className="relative flex min-h-[100svh] items-center pt-[var(--nav-h)] pb-16" data-scene="shield" data-side="center">
      <div className="container-px w-full">
        <div className="mx-auto max-w-2xl">
          <div className="eyebrow flex items-center gap-3">
            <span className="pulse-dot" /> Signed in as {email}
          </div>
          <h1 className="display mt-5 text-[clamp(34px,5vw,56px)]">
            {primary || access.admin ? (
              <>
                Where to, <span className="text-gradient-red">{firstName}?</span>
              </>
            ) : (
              <>
                Access <span className="text-gradient-red">paused.</span>
              </>
            )}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            {primary || access.admin
              ? "Your account has more than one kind of access. Pick where you want to go."
              : "Your PayXa workspace is currently suspended or was not approved, so the dashboard is unavailable."}
          </p>

          <div className="mt-10 space-y-3">
            {access.admin && (
              <Link
                href={adminEntry(access.admin)}
                prefetch={false}
                className="group flex items-center gap-5 rounded-2xl border border-white/[0.08] bg-[#0f0e12] p-5 transition-colors hover:border-crimson/40"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-crimson/10 text-neon">
                  <ShieldCheck size={22} />
                </span>
                <span className="flex-1">
                  <span className="block text-[15px] font-semibold">PayXa Admin Console</span>
                  <span className="block text-[13px] text-muted">
                    {roleLabel[access.admin.role] ?? access.admin.role} · security check, one-time ticket, then your authenticator code
                  </span>
                </span>
                <ArrowUpRight size={18} className="text-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            )}

            {open.map((m) => (
              <a
                key={m.merchantId}
                href={dashboardUrl(merchantLanding(m))}
                className="group flex items-center gap-5 rounded-2xl border border-white/[0.08] bg-[#0f0e12] p-5 transition-colors hover:border-crimson/40"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-white/[0.04] text-paper">
                  <Building2 size={22} />
                </span>
                <span className="flex-1">
                  <span className="block text-[15px] font-semibold">{m.businessName}</span>
                  <span className="block text-[13px] text-muted">
                    Merchant dashboard · {roleLabel[m.role] ?? m.role}
                    {m.status !== "ACTIVE" ? ` · ${m.status.replace("_", " ").toLowerCase()}` : ""}
                  </span>
                </span>
                <ArrowUpRight size={18} className="text-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            ))}

            {blocked.map((m) => (
              <div key={m.merchantId} className="flex items-center gap-5 rounded-2xl border border-crimson/30 bg-crimson/[0.05] p-5">
                <span className="grid size-12 place-items-center rounded-xl bg-crimson/10 text-neon">
                  <PauseCircle size={22} />
                </span>
                <span className="flex-1">
                  <span className="block text-[15px] font-semibold">{m.businessName}</span>
                  <span className="block text-[13px] text-muted">
                    {m.status === "SUSPENDED" ? "Suspended" : "Not approved"} · contact PayXa support to restore access
                  </span>
                </span>
                <Lock size={16} className="text-dim" />
              </div>
            ))}
          </div>

          {access.pendingInvites > 0 && (
            <a href={dashboardUrl("/no-workspace")} className="mt-4 flex items-center gap-3 rounded-2xl border border-warn/30 bg-warn/[0.05] p-4 text-[13px]">
              <UserPlus size={16} className="text-warn" />
              You have {access.pendingInvites} pending workspace invitation{access.pendingInvites > 1 ? "s" : ""}. Review in the dashboard.
            </a>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-4 text-[13px] text-muted">
            <Link href="/contact" className="hover:text-paper">
              Contact support
            </Link>
            <span className="text-dim">·</span>
            <form action={signOutAction}>
              <button type="submit" className="hover:text-paper">
                Sign in with a different account
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

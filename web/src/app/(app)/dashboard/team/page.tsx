import type { Metadata } from "next";
import { UserPlus } from "lucide-react";
import { PageHeader, Pill, td, th } from "@/components/dashboard/ui";
import { team } from "@/lib/dashboard-data";

export const metadata: Metadata = { title: "Team" };

const roles = [
  ["Owner", "Everything, including live access and payouts settings"],
  ["Admin", "Payments, links, devices, developers"],
  ["Viewer", "Read-only payments and alerts, ideal for counter staff"],
];

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader
        title="Team"
        subtitle="Invite people with the least access they need."
        actions={
          <button disabled title="Team invites arrive with merchant onboarding" className="inline-flex h-9 items-center gap-2 rounded-xl bg-crimson px-3.5 text-[13px] font-medium text-white opacity-60">
            <UserPlus size={15} /> Invite member
          </button>
        }
      />
      <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-[#0f0e12]">
        <table className="w-full">
          <thead className="border-b border-white/[0.05]">
            <tr>
              <th className={th}>Member</th>
              <th className={th}>Role</th>
              <th className={`${th} text-right`}>Last active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {team.map((m) => (
              <tr key={m.email}>
                <td className={td}>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-[12px] text-dim">{m.email}</div>
                </td>
                <td className={td}>
                  <Pill tone={m.role === "Owner" ? "bad" : m.role === "Admin" ? "info" : "muted"}>{m.role}</Pill>
                </td>
                <td className={`${td} text-right text-dim`}>{m.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {roles.map(([r, d]) => (
          <div key={r} className="rounded-2xl border border-white/[0.06] bg-[#0f0e12] p-5">
            <div className="text-[14px] font-semibold">{r}</div>
            <p className="mt-1 text-[13px] text-muted">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

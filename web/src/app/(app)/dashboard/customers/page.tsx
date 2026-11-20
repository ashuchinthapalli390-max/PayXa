import type { Metadata } from "next";
import { PageHeader, td, th } from "@/components/dashboard/ui";
import { ago, customers, formatINR } from "@/lib/dashboard-data";

export const metadata: Metadata = { title: "Customers" };

export default function CustomersPage() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Customers" subtitle="Customer references you pass when creating orders, with their payment history." />
      <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-[#0f0e12]">
        <table className="w-full">
          <thead className="border-b border-white/[0.05]">
            <tr>
              <th className={th}>Customer</th>
              <th className={th}>Reference</th>
              <th className={`${th} text-right`}>Payments</th>
              <th className={`${th} text-right`}>Verified total</th>
              <th className={`${th} text-right`}>Last seen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {customers.map((c) => (
              <tr key={c.ref} className="hover:bg-white/[0.02]">
                <td className={td}>
                  <span className="flex items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-full bg-white/[0.06] text-[11px] font-semibold">
                      {c.name
                        .split(" ")
                        .map((s) => s[0])
                        .join("")}
                    </span>
                    {c.name}
                  </span>
                </td>
                <td className={`${td} font-mono text-[12px] text-dim`}>{c.ref}</td>
                <td className={`${td} text-right tabular-nums`}>{c.payments}</td>
                <td className={`${td} text-right font-semibold tabular-nums`}>{formatINR(c.total)}</td>
                <td className={`${td} text-right text-dim`}>{ago(c.last)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

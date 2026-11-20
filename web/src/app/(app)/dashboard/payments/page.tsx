import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/ui";
import PaymentsTable from "@/components/dashboard/PaymentsTable";

export const metadata: Metadata = { title: "Payments" };

export default function PaymentsPage() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Payments" subtitle="Every checkout, detection and verification. Fulfil only on Verified." />
      <PaymentsTable />
    </div>
  );
}

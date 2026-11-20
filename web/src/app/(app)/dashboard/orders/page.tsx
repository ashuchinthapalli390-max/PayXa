import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/ui";
import PaymentsTable from "@/components/dashboard/PaymentsTable";

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Orders" subtitle="Orders created through the API, payment links and QR, with their checkout state." />
      <PaymentsTable compactTitle="All orders" />
    </div>
  );
}

import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/ui";
import { LinksManager } from "@/components/dashboard/Interactive";

export const metadata: Metadata = { title: "Payment Links" };

export default function LinksPage() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Payment Links" subtitle="Share a checkout anywhere: WhatsApp, SMS, email or social." />
      <LinksManager />
    </div>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/auth";
import Shell from "@/components/dashboard/Shell";

export const metadata: Metadata = { title: { default: "Dashboard", template: "%s · PayXa Dashboard" }, robots: { index: false } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");
  return <Shell user={{ name: session.user.name, email: session.user.email, image: session.user.image }}>{children}</Shell>;
}

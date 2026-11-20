import type { Metadata, Viewport } from "next";
import "@fontsource-variable/unbounded";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { CheckoutProvider } from "@/components/checkout/CheckoutProvider";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "PayXa — Payments. Without the wait.", template: "%s · PayXa" },
  description: site.description,
  openGraph: {
    title: "PayXa — Payments. Without the wait.",
    description: site.description,
    images: ["/brand/payxa-lockup.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#010101",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-ink text-paper antialiased">
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-crimson px-4 py-2 focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <CheckoutProvider>{children}</CheckoutProvider>
      </body>
    </html>
  );
}

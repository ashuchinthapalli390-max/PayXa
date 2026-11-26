import type { Metadata, Viewport } from "next";
import "@fontsource-variable/unbounded";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import AutofillGuard from "@/components/AutofillGuard";
import { CheckoutProvider } from "@/components/checkout/CheckoutProvider";
import { GlobalJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: "%s · PayXa",
  },
  description: site.description,
  applicationName: "PayXa",
  authors: [{ name: "CodeXa Agency", url: "https://codexa.agency" }],
  creator: "CodeXa Agency",
  publisher: "CodeXa Agency",
  category: "finance",
  alternates: {
    canonical: site.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [
      {
        url: `${site.url}/brand/payxa-lockup.png`,
        width: 1200,
        height: 630,
        alt: "PayXa — UPI Payment Automation for Indian Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [`${site.url}/brand/payxa-lockup.png`],
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/brand/payxa-mark.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#010101",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <GlobalJsonLd />
      </head>
      <body className="min-h-dvh bg-ink text-paper antialiased">
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-crimson px-4 py-2 focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <CheckoutProvider>{children}</CheckoutProvider>
        <AutofillGuard />
      </body>
    </html>
  );
}

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://payxa.in";
  // Static timestamp to maintain stable sitemap signals across releases
  const lastModified = new Date();

  const publicRoutes = [
    { path: "", changeFrequency: "daily" as const, priority: 1.0 },
    { path: "/about", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/products", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/products/checkout", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/products/payment-links", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/products/qr-payments", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/products/instant-alerts", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/how-it-works", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/developers", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/docs", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/pricing", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/security", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/download", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/solutions", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/integrations", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/help", changeFrequency: "weekly" as const, priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/brand", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/status", changeFrequency: "daily" as const, priority: 0.6 },
    { path: "/legal/terms", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/legal/privacy", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/legal/disclosures", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/legal/permissions", changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  return publicRoutes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}

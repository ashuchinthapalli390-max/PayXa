import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://payxa.in";
  const disallowList = [
    "/api/",
    "/auth/",
    "/login",
    "/register",
    "/continue",
    "/sso/",
    "/dashboard",
    "/dashboard/",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowList,
      },
      // Explicit rules for primary search engines and verified AI search discovery bots
      {
        userAgent: [
          "Googlebot",
          "Googlebot-Image",
          "Bingbot",
          "OAI-SearchBot",
          "PerplexityBot",
          "Claude-SearchBot",
          "Applebot",
        ],
        allow: "/",
        disallow: disallowList,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

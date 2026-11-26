import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native/database clients are loaded from node_modules at runtime instead of being bundled
  // (bundling @libsql pulls non-JS files such as its LICENSE into the build and fails).
  serverExternalPackages: ["@libsql/client", "libsql", "@libsql/hrana-client"],
  images: {
    // Google account avatars shown in the navbar after sign-in
    remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }],
  },
  async redirects() {
    return [
      { source: "/payment-links", destination: "/products/payment-links", permanent: true },
      { source: "/checkout", destination: "/products/checkout", permanent: true },
      { source: "/qr-payments", destination: "/products/qr-payments", permanent: true },
      { source: "/merchant-app", destination: "/download", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/login",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/register",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/continue",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/sso/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;

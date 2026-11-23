import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native/database clients are loaded from node_modules at runtime instead of being bundled
  // (bundling @libsql pulls non-JS files such as its LICENSE into the build and fails).
  serverExternalPackages: ["@libsql/client", "libsql", "@libsql/hrana-client"],
  images: {
    // Google account avatars shown in the navbar after sign-in
    remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }],
  },
};

export default nextConfig;

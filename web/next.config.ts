import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Google account avatars shown in the dashboard user menu
    remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }],
  },
};

export default nextConfig;

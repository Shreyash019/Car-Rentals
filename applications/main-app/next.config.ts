import type { NextConfig } from "next";

const ADMIN_URL: string | undefined = process.env.ADMIN_URL;

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    if(!ADMIN_URL) return [];
    return [
      { source: "/admin", destination: `${ADMIN_URL}/admin`},
      { source: "/admin/:path*", destination: `${ADMIN_URL}/admin/:path*`},
    ]
  }
};

export default nextConfig;

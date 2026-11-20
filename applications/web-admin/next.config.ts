import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: "/admin",
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    optimizePackageImports: ["@car-rentals/ui"],
    serverActions: {
      allowedOrigins: (process.env.PUBLIC_ORIGINS ?? "localhost:3001").split(
        ",",
      ),
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

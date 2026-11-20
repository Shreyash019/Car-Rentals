import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const ADMIN_APP_URL = process.env.ADMIN_APP_URL;
const PROVIDER_APP_URL = process.env.PROVIDER_APP_URL;

function zoneOrigin(envName: string): string | undefined {
  const raw = process.env[envName];
  if (!raw) {
    const msg = `[web-customers] ${envName} is not set`;
    if (isProd) throw new Error(`${msg}. It is required at build time.`);
    console.warn(`${msg}. Requests to that zone will 404 in dev.`);
    return undefined;
  }
  try {
    return new URL(raw).origin;
  } catch {
    throw new Error(`[web-customers] ${envName} is not a valid URL: "${raw}"`);
  }
}

const ZONES = [
  { basePath: "/admin", origin: zoneOrigin("ADMIN_APP_URL") },
  { basePath: "/providers", origin: zoneOrigin("PROVIDER_APP_URL") },
] as const;

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
    const zoneRewrites = ZONES.flatMap(({ basePath, origin }) =>
      origin
        ? [
            { source: basePath, destination: `${origin}${basePath}` },
            {
              source: `${basePath}/:path*`,
              destination: `${origin}${basePath}/:path*`,
            },
          ]
        : [],
    );
    return {
      beforeFiles: zoneRewrites,
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;

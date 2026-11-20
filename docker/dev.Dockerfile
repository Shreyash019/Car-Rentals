# Dev image only: source code is NOT copied, it comes from the bind mount.
FROM node:22-bookworm-slim

# pnpm via corepack, pinned to the version in package.json "packageManager"
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@10.29.3 --activate
RUN pnpm config set store-dir /app/node_modules/.pnpm-store --global

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app
EXPOSE 3001 3005 3011

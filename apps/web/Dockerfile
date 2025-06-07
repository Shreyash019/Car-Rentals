# ---- Base Node ----
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ---- Build ----
FROM base AS build
COPY . .
RUN npx nx build web

# ---- Production ----
FROM node:20-alpine AS prod
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production --ignore-scripts
COPY --from=build /app/apps/web/.next ./.next
COPY --from=build /app/apps/web/public ./public
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000
CMD ["npx", "next", "start"]

# ---- Base Node ----
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ---- Build ----
FROM base AS build
WORKDIR /app
COPY . .
RUN npx nx build api-products

# ---- Production ----
FROM node:20-alpine AS prod
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production --ignore-scripts
COPY --from=build /app/apps/api-products/dist ./dist
ENV NODE_ENV=production
EXPOSE 4002
CMD ["node", "dist/main.js"]

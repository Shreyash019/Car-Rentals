# ---- Base Node ----
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ---- Build ----
FROM base AS build
WORKDIR /app
COPY . .
RUN npx nx build api-bookings

# ---- Production ----
FROM node:20-alpine AS prod
WORKDIR /app
# Copy only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production --ignore-scripts
# Copy built app
COPY --from=build /app/apps/api-bookings/dist ./dist
# Copy any runtime config if needed (e.g., nest-cli.json, tsconfig.build.json)
# COPY apps/api-bookings/nest-cli.json ./nest-cli.json
# COPY apps/api-bookings/tsconfig.build.json ./tsconfig.build.json
ENV NODE_ENV=production
EXPOSE 4003
CMD ["node", "dist/main.js"]

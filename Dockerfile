# syntax=docker/dockerfile:1
# Production image for Dokploy / any Docker host.
# - Multi-stage: deps → build → slim runner (Next.js standalone output)
# - Uploaded media lives in /app/media — mount a volume there.
# - Database schema: pending migrations (src/migrations) run automatically on first start.

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable pnpm
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml .npmrc* ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# NEXT_PUBLIC_SERVER_URL is inlined into client bundles at build time.
ARG NEXT_PUBLIC_SERVER_URL=https://protpure.com
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
# Static pages are prerendered against the database at build time; provide DATABASE_URL and
# PAYLOAD_SECRET as build args/secrets, or the build falls back to an empty catalogue.
ARG DATABASE_URL
ARG PAYLOAD_SECRET
ENV DATABASE_URL=$DATABASE_URL PAYLOAD_SECRET=$PAYLOAD_SECRET NODE_ENV=production
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Seed assets for POST /api/seed (first-run content import)
COPY --from=builder --chown=nextjs:nodejs /app/seed ./seed
RUN mkdir -p /app/media /app/media/documents && chown -R nextjs:nodejs /app/media
VOLUME ["/app/media"]
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s CMD wget -qO- http://127.0.0.1:3000/api/public/company >/dev/null || exit 1
CMD ["node", "server.js"]

FROM node:20-bullseye-slim AS deps
WORKDIR /app

# Ensure Yarn is available/lates
RUN corepack enable && corepack prepare yarn@stable --activate

# Copy dependency manifests
COPY package.json yarn.lock ./

# Install production+dev deps (to reuse in builder)
RUN yarn install

FROM node:20-bullseye-slim AS builder
WORKDIR /app

# Reuse installed modules
COPY --from=deps /app/node_modules ./node_modules

# Copy source files
COPY . .

# Build arguments injected by Cloud Build (defaults keep template working)
ARG BACKEND_API_URI=https://api.smtximob.com
ARG EMPRESA_ID=7658c0cd-573e-44e3-ac1a-09a51b4c714c
ARG NEXT_PUBLIC_EMPRESA_ID
ARG NEXT_PUBLIC_BACKEND_API_URI=https://api.smtximob.com

ENV BACKEND_API_URI=$BACKEND_API_URI
ENV EMPRESA_ID=$EMPRESA_ID
ENV NEXT_PUBLIC_EMPRESA_ID=$NEXT_PUBLIC_EMPRESA_ID
ENV NEXT_PUBLIC_BACKEND_API_URI=$NEXT_PUBLIC_BACKEND_API_URI

RUN yarn build

FROM node:20-bullseye-slim AS runner
WORKDIR /app

# Re-declare build args for runtime
ARG BACKEND_API_URI=https://api.smtximob.com
ARG EMPRESA_ID
ARG NEXT_PUBLIC_EMPRESA_ID
ARG NEXT_PUBLIC_BACKEND_API_URI=https://api.smtximob.com

ENV NODE_ENV=production
ENV PORT=8080
ENV BACKEND_API_URI=$BACKEND_API_URI
ENV EMPRESA_ID=$EMPRESA_ID
ENV NEXT_PUBLIC_EMPRESA_ID=$NEXT_PUBLIC_EMPRESA_ID
ENV NEXT_PUBLIC_BACKEND_API_URI=$NEXT_PUBLIC_BACKEND_API_URI

# Bring compiled app and static assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 8080

CMD ["yarn", "start", "-p", "8080"]

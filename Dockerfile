# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Run in CI mode to make pnpm non-interactive (avoids TTY prompts)
ENV CI=true

# Copy only package manifests and lockfile first for better caching
COPY demon-threshold/package.json demon-threshold/pnpm-lock.yaml ./

# Install pnpm from corepack, prepare a modern pnpm and ensure build tools
# Enable corepack and ensure CA certs + build tools are present
RUN corepack enable

# Install certificates and basic build tools for native modules
RUN apk add --no-cache ca-certificates curl python3 make g++ build-base

# Install pnpm via npm to avoid corepack fetching issues inside the container
# Install latest pnpm v8.x series only if not present (prevents EEXIST)
RUN if ! command -v pnpm >/dev/null 2>&1; then \
		npm install -g pnpm@8; \
	else \
		echo "pnpm already installed, skipping"; \
	fi \
	&& pnpm -v

# First install attempt (may list ignored builds but won't stop the image build)
RUN pnpm install --frozen-lockfile --reporter=append-only --unsafe-perm || true

# Approve any ignored builds non-interactively and reinstall so build scripts run
RUN pnpm approve-builds --all || true
RUN pnpm install --frozen-lockfile --reporter=append-only --unsafe-perm

# Copy app sources and build
COPY demon-threshold/ ./
RUN pnpm build

# Production stage
FROM nginx:stable-alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built app from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

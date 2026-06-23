# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Run in CI mode to make pnpm non-interactive
ENV CI=true

# 1. CAMBIO AQUÍ: Como el Dockerfile ya está en frontend, copiamos directo
COPY package.json pnpm-lock.yaml ./

# Enable corepack and ensure CA certs + build tools are present
RUN corepack enable
RUN apk add --no-cache ca-certificates curl python3 make g++ build-base

# Install pnpm via npm to avoid corepack fetching issues inside the container
RUN if ! command -v pnpm >/dev/null 2>&1; then \
		npm install -g pnpm@8; \
	else \
		echo "pnpm already installed, skipping"; \
	fi \
	&& pnpm -v

# Install dependencies
RUN pnpm install --frozen-lockfile --reporter=append-only --unsafe-perm || true
RUN pnpm approve-builds --all || true
RUN pnpm install --frozen-lockfile --reporter=append-only --unsafe-perm

# 2. CAMBIO AQUÍ: Copiamos todo el código fuente del frontend directamente
COPY . .

# Build the project
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
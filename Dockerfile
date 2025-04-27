# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies first (cached unless package.json changes)
COPY package*.json ./
RUN npm ci --include=dev  # Install dev dependencies including TypeScript

# Copy source files and build
COPY . .
RUN npm run build  # This runs 'tsc' and 'vite build'

# Stage 2: Production image
FROM node:18-alpine
WORKDIR /app

# Copy production files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

# Install only production dependencies
RUN npm ci --omit=dev

# Expose and run
EXPOSE 8080
CMD ["npm", "run", "preview"]


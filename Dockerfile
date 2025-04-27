
# Stage 2: Production image
FROM node:23-alpine
WORKDIR /app

#COPY . .
# Copy production files
COPY legal-qa-frontend/ ./


RUN npm install vite
RUN npm install typescript bootstrap @popperjs/core -g
# Install only production dependencies
RUN npm ci #--omit=dev
RUN npm run build

# Expose and run
EXPOSE 8080
CMD ["npm", "run", "dev"]


FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better Docker layer caching)
COPY package*.json ./
RUN npm install --omit=dev

# Copy the app code
COPY . .

ENV PORT=3000
EXPOSE 3000

# Run as non-root user
USER node

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "server.js"]

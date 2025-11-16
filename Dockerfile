FROM mcr.microsoft.com/playwright:v1.56.0-jammy

WORKDIR /app

# Kopiuj package files
COPY package*.json ./

# Instaluj dependencies
RUN npm ci --only=production

# Kopiuj resztę plików
COPY . .

# Instaluj przeglądarki Playwright
RUN npx playwright install chromium

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start
CMD ["node", "server.js"]
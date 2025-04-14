# Use a lightweight Node.js image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency definitions first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all server source code
COPY . .

# Optional: explicitly define .env loading (for runtime clarity)
ENV NODE_ENV=production

# Expose backend API port
EXPOSE 5000

# Start the Express server
CMD ["node", "index.js"]

# Stage 1: Build React app
FROM node:18-alpine as build

WORKDIR /app

# Copy package.json + .env early to leverage caching
COPY package*.json ./
COPY .env .env             

RUN npm install

# Copy the rest of the app
COPY . .

# Build React app with embedded env vars
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

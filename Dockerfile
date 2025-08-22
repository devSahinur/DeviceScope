# Use Node.js LTS as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install required packages for Expo and React Native
RUN apk add --no-cache git bash

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy app source
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S appuser
RUN adduser -S appuser -u 1001 -G appuser

# Change ownership of the app directory
RUN chown -R appuser:appuser /app
USER appuser

# Expose the port Expo runs on
EXPOSE 8081
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Start the Expo development server
CMD ["npx", "expo", "start", "--tunnel"]
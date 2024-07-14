# frontend/Dockerfile

# Use official Node.js image as a base
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy project
COPY . ./

# Build project
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start server
CMD ["npm", "start"]

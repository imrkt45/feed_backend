# Use a lightweight Node.js base image
FROM node:20-slim

# Set working directory
WORKDIR /usr/src/app

# Install dependencies before copying source
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Development environment variables
ENV NODE_ENV=development
ENV PORT=5000

# Expose the default application port
EXPOSE 5000

# Start the application using nodemon for live reload during development
CMD ["npm", "run", "dev"]

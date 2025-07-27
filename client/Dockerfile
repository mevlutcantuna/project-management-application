FROM node:22-alpine

# Set working directory
WORKDIR /app

# Add package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]

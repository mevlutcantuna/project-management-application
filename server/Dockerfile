# Development stage
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install all dependencies (including dev dependencies)
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

# Start the application in development mode
CMD ["yarn", "dev"]
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Add package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["yarn", "dev"]

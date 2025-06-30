# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /nckdashboard

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3400

# Expose port
EXPOSE 3400

# Start the application
CMD ["yarn", "start"]


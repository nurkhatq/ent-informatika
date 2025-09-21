FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build with environment variables
ENV NEXT_PUBLIC_API_URL=http://localhost:8000/api
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
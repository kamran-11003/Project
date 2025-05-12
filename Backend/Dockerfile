FROM node:18-alpine

LABEL maintainer="kamran0003"

WORKDIR /app

# Install MongoDB
RUN apk add --no-cache mongodb-tools

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Create .env file
# Server Configuration
ENV PORT=5000
ENV NODE_ENV=production

# Database Configuration
ENV MONGODB_URI=mongodb+srv://kamran:5XvG4bRRW6BUbrmg@cluster0.njzbkkr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
ENV JWT_SECRET=your_jwt_secret_key_here
ENV JWT_EXPIRE=30d
ENV JWT_COOKIE_EXPIRE=30



# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"] 
# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 7272 for the server to listen on
EXPOSE 4000

# Start the server
CMD ["npm", "start"]
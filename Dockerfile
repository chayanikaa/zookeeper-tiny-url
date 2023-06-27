# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies inside the container
RUN npm install

# Bundle the app source inside the Docker image
COPY . .

# Expose port 3000 to have it mapped by Docker daemon
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "run", "start:dev"]

FROM node:18.16.0

WORKDIR /app

COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]


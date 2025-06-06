FROM node:lts-buster

# Install build tools required for native modules like better-sqlite3
RUN apt-get update && \
    apt-get install -y build-essential clang python3 make g++ && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Clone the project repository
RUN git clone https://github.com/NOTHING-MD420/project-test.git

# Set working directory to your bot's root path
WORKDIR /project-test/root/igNothing

# Install better-sqlite3 from source to avoid prebuild issues, then install all dependencies
RUN npm install --build-from-source=better-sqlite3 && \
    npm install && \
    npm install -g pm2

# Copy remaining files into the container (if you have .env or local configs)
COPY . .

# Expose the port used by your bot
EXPOSE 9090

# Start the bot using PM2
CMD ["npm", "start"]
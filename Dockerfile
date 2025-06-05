FROM node:lts-buster

# Clone the whole repo
RUN git clone https://github.com/NOTHING-MD420/project-test.git

# Set working directory to the subfolder
WORKDIR /project-test/root/igNothing

# Install dependencies
RUN npm install && npm install -g pm2 || yarn install --network-concurrency 1

# Copy local context (optional, if you have local changes to add)
COPY . .

EXPOSE 9090
CMD ["npm", "start"]
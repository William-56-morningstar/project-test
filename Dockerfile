FROM node:lts-buster
RUN git clone https://github.com/NOTHING-MD420/project-test/root/igNothing
WORKDIR /root/igNothing
RUN npm install && npm install -g pm2 || yarn install --network-concurrency 1
COPY . .
EXPOSE 9090
CMD ["npm", "start"]

FROM node:9.7.1
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .
EXPOSE 6060
CMD [ "npm", "start" ]

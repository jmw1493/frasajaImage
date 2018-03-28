# set the base image to Debian
# https://hub.docker.com/_/debian/
FROM ubuntu:16.04

# install node, docker, and kubectl
ARG DOCKER_VERSION="latest"
ADD install.sh ./install.sh
RUN chmod +x ./install.sh \
    && ./install.sh

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
# RUN webpack

# Bundle app source
# dockerignore will ignore the old client folder
COPY . .
EXPOSE 8080

CMD ["npm", "start"]

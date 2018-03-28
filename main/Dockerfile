# set the base image to Debian
# https://hub.docker.com/_/debian/
FROM ubuntu:16.04
# FROM alpine

# install node, docker, and kubectl
ENV KUBE_LATEST_VERSION="v1.10.0"
ENV DOCKER_VERSION="latest"

# RUN apk add --update bash && rm -rf /var/cache/apk/*
ADD install.sh ./install.sh
RUN chmod +x ./install.sh \
    && ./install.sh

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
RUN npm install webpack@3.11.0 -g
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# use webpack to bundle and remove the uneccessary files
COPY . ./
RUN webpack
RUN rm -r ./client
RUN rm ./webpack.config.js

EXPOSE 8080

CMD ["npm", "start"]

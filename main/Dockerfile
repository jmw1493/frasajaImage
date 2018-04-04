# set the base image to Alpine w/ node -> https://hub.docker.com/_/node/
FROM node:9.10-alpine

# setting versions of dependencies
ENV KUBE_LATEST_VERSION="v1.10.0"

# set working directory. Creates this if it does not exist. Copying package.json and all other volume mounted files into the working directory
WORKDIR /usr/src/app
COPY . ./

# Recursively gives unix user read write and executable access to entire project directory run shell file. Then runs a shell to install additional external packages.
RUN chmod -R 777 ./ && \
    ./install.sh

# installing yarn (faster version of NPM). Running npm install equivalent (abbreviated to just yarn), running yarn build (webpack), and then cleaning up all non-production dependencies.
RUN npm install -g -s --no-progress yarn && \
    yarn && \
    yarn run build && \
    yarn install && \
    yarn cache clean

# Further remove the unnecessary files. Webpack has already bundled client files, both can be removed.
RUN rm -r ./client
RUN rm ./webpack.config.js

EXPOSE 8080

CMD [ "yarn", "start" ]

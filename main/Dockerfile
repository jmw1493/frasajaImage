# set the base image to Debian
# https://hub.docker.com/_/debian/
FROM teracy/ubuntu:16.04-dind-17.06.0-ce

#RUN $(minikube docker-env)

# update the repository sources list
# and install dependencies
RUN apt-get update \
    && apt-get install -y curl \
    && apt-get -y autoclean

# update the repository sources list
# and install dependencies
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash && \
    apt-get install -y nodejs build-essential

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# confirm installation
RUN node -v
RUN npm -v
CMD ["npm", "start"]

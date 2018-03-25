#!/bin/bash

# eval $(minikube docker-env)

# make sure latest package installed
# clear out the local repository of retrieved package files
# curl is a data transfer program, and is commonly
# used to download websites or files via the command line
apt-get update \
&& apt-get install -q -y \
    curl \
&& apt-get clean && rm -rf /var/lib/apt/lists/* \
; \
\

# use the script at get.docker.com to install the latest release of Docker CE on Linux
curl -sSL https://get.docker.com/ | sh; \

# install docker-compose
# Compose is a tool for defining and running multi-container Docker applications.
DOCKER_VERSION=$(docker -v | cut -d ',' -f1 | grep -o -E '[0-9].*'); \
DOCKER_COMPOSE_VERSION="$(curl -s https://github.com/docker/toolbox/releases/tag/v$DOCKER_VERSION | grep 'docker-compose' | cut -d '>' -f3 | cut -d '<' -f1)"; \
\
curl -L https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` > docker-compose; \
chmod +x /usr/local/bin/docker-compose

# update the repository sources list
# and install dependencies
curl -sL https://deb.nodesource.com/setup_6.x | bash && \
    apt-get install -y nodejs build-essential

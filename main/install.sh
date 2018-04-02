#!/bin/sh
echo " " && \
echo "==> Downloading External Packages <==" \

# 1.) Update list of available packages, then download curl + docker packages. no--cache option allows you to not cache index locally. Keeps container small.
apk update && \
apk --no-cache add curl docker 

# 2.) Download kubernetes and put it into a new directory. Give super user permissions
curl -L https://storage.googleapis.com/kubernetes-release/release/${KUBE_LATEST_VERSION}/bin/linux/amd64/kubectl -o /usr/local/bin/kubectl 
chmod +x /usr/local/bin/kubectl 

echo "==> Download Complete <==" && \
echo " " && \
echo "==> Continuing Container Setup..." \

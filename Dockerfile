FROM node:7.4.0-alpine

MAINTAINER Ville De Montréal

# HTTP server port
ENV MTL_API_SERVER_PORT=12345

# Debugging port
ENV MTL_API_DEBUG_PORT=5858

# Work dir
WORKDIR /mtl/app

# Copies the project files
COPY . /mtl/app

# Installs bash, dependencies and transpiles
# the application.
RUN apk add --update bash nano tzdata && \
    rm -rf /var/cache/apk/* && \
    rm /bin/sh && ln -s /bin/bash /bin/sh && \
    cp /usr/share/zoneinfo/America/Montreal /etc/localtime && \
    echo "America/Montreal" >  /etc/timezone && \
    printf "\\nalias ll=\"ls -la\"\\n" >> ~/.bashrc && \
    npm install -g typescript@2.2.1 gulp-cli@1.2.2 && \
    npm install && \
    gulp compile

# Exposes the ports
EXPOSE $MTL_API_SERVER_PORT $MTL_API_DEBUG_PORT

# Runs the application, when the container starts.
#
# It is possible to override this command
# when starting the container, for example to
# enter it using a shell.
CMD ["gulp", "start", "--nc"]

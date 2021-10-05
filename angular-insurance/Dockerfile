    # # Create image based on the official Node 6 image from dockerhub
    # FROM node:16 As builder

    # # Create a directory where our app will be placed
    # RUN mkdir -p /usr/src/app

    # # Change directory so that our commands run inside this new directory
    # WORKDIR /usr/src/app

    # # Copy dependency definitions
    # COPY package.json /usr/src/app

    # # Install dependecies
    # RUN npm install

    # # Get all the code needed to run the app
    # COPY . /usr/src/app

    # # CMD ["/bin/sh",  "-c",  "envsubst < /usr/src/app/assets/env.template.js > /usr/src/app/assets/env.js"]

    # # Expose the port the app runs in
    # EXPOSE 4200

    # # CMD ["/bin/sh",  "-c",  "cat cat1"]
    # # CMD ["cat", "cat2"]    

    # # Serve the app
    # CMD ["npm", "start"]

    #----------------------
### STAGE 1: BUILD ###
#---------------------

### STAGE 1:BUILD ###
# Defining a node image to be used as giving it an alias of "build"
# Which version of Node image to use depends on project dependencies 
# This is needed to build and compile our code 
# while generating the docker image
FROM node:12.14-alpine AS build
# Create a Virtual directory inside the docker image
WORKDIR /dist/src/app
# Copy files to virtual directory
# COPY package.json package-lock.json ./
# Run command in Virtual directory
RUN npm cache clean --force
# Copy files from local machine to virtual directory in docker image
COPY . .
RUN npm install
RUN npm run build --prod


### STAGE 2:RUN ###
# Defining nginx image to be used
FROM nginx:latest AS ngi
# Copying compiled code and nginx config to different folder
# NOTE: This path may change according to your project's output folder 
COPY --from=build /dist/src/app/dist/angular-insurance /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
# Exposing a port, here it means that inside the container 
# the app will be using Port 80 while running
EXPOSE 4200

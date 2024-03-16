#Docker


FROM node:latest AS base


LABEL maintainer="Aanand Aman <aaman8@myseneca.ca>"
LABEL description="Fragments-UI microservice"

# We default to use port 8080 in our service
ENV PORT=80

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false


# Use /app as working directory
WORKDIR /app
 
# Copy the package.json and package-lock.json
COPY package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm i


FROM node:latest AS build

# Use /app as our working directory
WORKDIR /app

#Copy node modules and jsons from base
COPY .env ./
COPY --from=base /app/package*.json ./ 
COPY --from=base /app/node_modules ./node_modules

# Copy src to /app/src/
COPY src ./src

# Start the container by running our server
RUN npm run build

FROM nginx:latest AS deploy

# COPY items we need to run
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/.parcel-cache /usr/share/nginx/html

# We run our service on port 8080
EXPOSE 8080
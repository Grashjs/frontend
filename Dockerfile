# FROM node:21.6.1

# ENV REACT_APP_API_URL=$REACT_APP_API_URL
# ENV REACT_APP_GOOGLE_KEY=$REACT_APP_GOOGLE_KEY
# ENV REACT_APP_GOOGLE_TRACKING_ID=$REACT_APP_GOOGLE_TRACKING_ID

# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build
# EXPOSE 3000
# CMD [ "npm", "run", "start" ]

# pull official base image
FROM node:21.6.1

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_GOOGLE_KEY=$REACT_APP_GOOGLE_KEY
ENV REACT_APP_GOOGLE_TRACKING_ID=$REACT_APP_GOOGLE_TRACKING_ID

# set working directory
WORKDIR /app
# Copies package.json and package-lock.json to Docker environment
COPY package*.json ./
# Installs all node packages
RUN npm install
# Copies everything over to Docker environment
COPY . .
# Build for production.
RUN npm run build --production
# Install `serve` to run the application.
RUN npm install -g serve
# Uses port which is used by the actual application
EXPOSE 3000
# Run application
#CMD [ "npm", "start" ]
CMD serve -s build

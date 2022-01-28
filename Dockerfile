FROM node:14.7.0

# http server
ARG HOST
ARG PORT
# database server
ARG PG_DATABASE
ARG PG_USER
ARG PG_PASS
# JWT secret
ARG ACCESS_TOKEN_KEY
ARG ACCESS_TOKEN_AGE
ARG REFRESH_TOKEN_KEY

WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD npm start
EXPOSE 5000
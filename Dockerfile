FROM node:14.7.0

################################
# get args from docker build
################################

# http server
ARG HOST
ARG PORT
# database server
ARG PGHOST
ARG PG_DATABASE
ARG PG_USER
ARG PG_PASS
# JWT secret
ARG ACCESS_TOKEN_KEY
ARG ACCESS_TOKEN_AGE
ARG REFRESH_TOKEN_KEY

################################
# copy args to env
################################

ENV HOST $HOST
ENV PORT $PORT
ENV PGHOST $PGHOST
ENV PG_DATABASE $PG_DATABASE
ENV PG_USER $PG_USER
ENV PG_PASS $PG_PASS
ENV ACCESS_TOKEN_KEY $ACCESS_TOKEN_KEY
ENV ACCESS_TOKEN_AGE $ACCESS_TOKEN_AGE
ENV REFRESH_TOKEN_KEY $REFRESH_TOKEN_KEY 

WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD npm start
EXPOSE 5000
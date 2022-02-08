FROM node:14.7.0

# will be used as nginx port
ARG PORT=9999
ENV PORT $PORT

RUN apt update && \
    apt install -y nginx && \
    apt install -y sudo

COPY nginx.conf /etc/nginx/conf.d/default.conf

# RUN sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf

RUN cat /etc/nginx/conf.d/default.conf

# RUN sed -i '/^user www-data;/i daemon off;' /etc/nginx/nginx.conf

RUN sed -i '/^user www-data;/d' /etc/nginx/nginx.conf

RUN cat /etc/nginx/nginx.conf | head

################################
# get args from docker build
################################

# http server
ARG HOST
# ARG PORT
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
# ENV PORT 5000
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
# CMD PORT=5000 npm start

COPY cmd-wrapper.sh cmd-wrapper.sh
RUN /bin/bash -c 'chmod +x ./cmd-wrapper.sh'

# RUN useradd -m docker && echo "docker:docker" | chpasswd && adduser docker sudo

# RUN adduser --disabled-password --gecos '' docker
# RUN adduser docker sudo
# RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# USER docker
CMD ["/bin/bash", "-c", "./cmd-wrapper.sh"]
EXPOSE $PORT

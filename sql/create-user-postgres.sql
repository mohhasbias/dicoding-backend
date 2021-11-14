create database forum_api_dev;
create user devel with encrypted password 'secret';
grant all privileges on database forum_api_dev to devel;

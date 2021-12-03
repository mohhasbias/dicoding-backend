# Using Clean Architecture Implementation in NodeJS

[![Node.js CI](https://github.com/mohhasbias/dicoding-backend/actions/workflows/node.js.yml/badge.svg?branch=main&event=push)](https://github.com/mohhasbias/dicoding-backend/actions/workflows/node.js.yml)

this is an implementaion of back end API using clean architecture approach.

- [Using Clean Architecture Implementation in NodeJS](#using-clean-architecture-implementation-in-nodejs)
- [Requirements](#requirements)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Clean Architecture Elements](#clean-architecture-elements)
  - [Infrastructures](#infrastructures)
  - [Interfaces](#interfaces)
  - [Use Cases](#use-cases)
  - [Entities](#entities)
- [References](#references)

# Requirements

1. NodeJS (v.14.7.0)
2. PostgreSQL

# Dependencies

- install dependencies using `npm install`

- setup appropriate database migrations using `npm run migrate:latest`

# Configuration

modify the `.env` to configure the app. here is the list of configurable options
| Name              |            Description             |
| :---------------- | :--------------------------------: |
| HOST              |              hostname              |
| PORT              |       port number to listen        |
| PG_DATABASE       |           database name            |
| PG_USER           |         database username          |
| PG_PASS           |         database password          |
| ACCESS_TOKEN_KEY  |        key for access token        |
| ACCESS_TOKEN_AGE  | expiration time for key in seconds |
| REFRESH_TOKEN_KEY |       key for refresh token        |

# Running the Application

run the application using `npm start`

# Testing

- test the app using command line version of postman using `npm test:postman`
  or use Postman App
- testing and coverage using jest via `npm test`
- unit testing using jest via `npm run test:unit`
- integration testing using jest via `npm run test:integration`

# Clean Architecture Elements

## Infrastructures

-   hapijs (server.js)
-   postgresql (db.js)
-   winston (logger.js)

## Interfaces

-   http handlers
-   repository (db handlers)

## Use Cases

as listed in `use-cases` folder

## Entities

as listed in `entities` folder

# References

[Menjadi Back-End Developer Expert - Dicoding Indonesia](https://www.dicoding.com/academies/276)
[Using Clean Architecture for Microservice APIs in Node.js with MongoDB and Express](https://www.youtube.com/watch?v=CnailTcJV_U)

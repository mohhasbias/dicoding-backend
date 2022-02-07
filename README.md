# Using Clean Architecture Implementation in NodeJS

[![Node.js CI](https://github.com/mohhasbias/dicoding-backend/actions/workflows/node.js.yml/badge.svg?branch=main&event=push)](https://github.com/mohhasbias/dicoding-backend/actions/workflows/node.js.yml)

This is an implementaion of back end API using clean architecture approach.

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

- Install dependencies using `npm install`

- Setup appropriate database migrations using `npm run migrate:latest`

# Configuration

Modify the `.env` to configure the app. here is the list of configurable options
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

Run the application using `npm start`

# Testing

- Test the app using command line version of postman using `npm test:postman`
  or use Postman App
- Unit testing using jest via `npm run test:unit`
- Integration testing using jest via `npm run test:integration`
- Testing and coverage using jest via `npm test`

# Clean Architecture Elements

## Infrastructures

- hapijs (server.js)
- postgresql (db.js)
  - repository (db queries)
- winston (logger.js)

## Interfaces

- http handlers
- repl

## Use Cases

As listed in `use-cases` folder

## Entities

As listed in `entities` folder

# References

- [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Menjadi Back-End Developer Expert - Dicoding Indonesia](https://www.dicoding.com/academies/276)
- [Using Clean Architecture for Microservice APIs in Node.js with MongoDB and Express](https://www.youtube.com/watch?v=CnailTcJV_U)
- [Common web application architectures](https://docs.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures#clean-architecture)
- [Deploy Microservices with Docker ARG & ENV Variables on Heroku with GitHub Actions](https://www.bundleapps.io/blog/docker-env-arg-heroku-github-actions-guide)

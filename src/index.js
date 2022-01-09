require('dotenv').config();

// system wide options
const logger = require('./infrastructures/logger');

const options = {
    logger
};

// infrastructures
const createServer = require('./infrastructures/server');
const { createRepository } = require('./infrastructures/db');
const repository = require('./infrastructures/db/repository');

// interfaces
const createRoutes = require('./interfaces');

// secondary infrastructures are passed as services
const environment = process.env.NODE_ENV || 'development';
const dbConfig = require('./knexfile')[environment];

const services = {
    repository: createRepository(dbConfig, repository, options),
};

// main loop
(async () => {
    // start main infrastructure
    const httpConfig = {
        host: process.env.HOST,
        port: process.env.PORT,
    };
    const server = await createServer(httpConfig, createRoutes(services, options), options);
    await server.start();
    logger.info(`server start at ${server.info.uri}`);
})();

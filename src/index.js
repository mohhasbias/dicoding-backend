require('dotenv').config();

// infrastructures
const createServer = require('./infrastructures/server');
const db = require('./infrastructures/db');
const logger = require('./infrastructures/logger');

// interfaces
const routes = require('./interfaces');

const config = {
    host: process.env.HOST,
    port: process.env.PORT,
};

// secondary infrastructures are passed as services
const services = {
    db,
    logger,
};

(async () => {
    // create main infrastructure
    const server = await createServer(config, routes(services));
    await server.start();
    logger.info(`server start at ${server.info.uri}`);
})();

require('dotenv').config();

const createServer = require('./infrastructures/server');
const db = require('./infrastructures/db');
const logger = require('./infrastructures/logger');
const routes = require('./interfaces');

const config = {
    host: process.env.HOST,
    port: process.env.PORT,
};

const services = {
    db,
    logger,
};

(async () => {
    const server = await createServer(config, routes(services));
    await server.start();
    logger.info(`server start at ${server.info.uri}`);
})();

require('dotenv').config();

// infrastructures
const logger = require('./infrastructures/logger');
const createServer = require('./infrastructures/server');

const dependencyInjection = require('./container4http');

// start http listener
(async () => {
    // start main infrastructure
    const httpConfig = {
        host: process.env.HOST,
        port: process.env.PORT,
    };
    const server = await createServer(httpConfig, dependencyInjection.routes, {
        logger: dependencyInjection.logger,
    });
    await server.start();
    logger.info(`server start at ${server.info.uri}`);
})();

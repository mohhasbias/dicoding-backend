require('dotenv').config();

// system wide options
const logger = require('./infrastructures/logger');

const options = {
    logger,
};

// infrastructures
const createServer = require('./infrastructures/server');
const {
    createDbConnection,
    createRepository,
} = require('./infrastructures/db');
const repository = require('./infrastructures/db/repository');

// interfaces
const createRoutes = require('./interfaces');
const routesAndHandlers = require('./interfaces/handler');

// secondary infrastructures are passed as services
const environment = process.env.NODE_ENV || 'development';
const dbConfig = require('./knexfile')[environment];
const dbConn = createDbConnection(dbConfig, options);

const services = {
    db: dbConn,
    repository: createRepository(dbConn, repository, options),
};

// main loop
(async () => {
    // start main infrastructure
    const httpConfig = {
        host: process.env.HOST,
        port: process.env.PORT,
    };
    const server = await createServer(
        httpConfig,
        createRoutes(services, routesAndHandlers, options),
        options
    );
    await server.start();
    logger.info(`server start at ${server.info.uri}`);
})();

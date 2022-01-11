require('dotenv').config();

const awilix = require('awilix');

// infrastructures
const createServer = require('./infrastructures/server');
const { createDbConnection } = require('./infrastructures/db');
const logger = require('./infrastructures/logger');
const knexfile = require('./knexfile');

const environment = process.env.NODE_ENV || 'development';
const dbConfig = knexfile[environment];
const dbConn = createDbConnection(dbConfig, { logger });

// interfaces
const makeRoutesAndHandlers = require('./interfaces/handler');

// dependencies injection
const containerToInjector = (container) =>
    Object.keys(container.registrations).reduce(
        (acc, key) => ({ ...acc, [key]: container.resolve(key) }),
        {}
    );

const repositoryContainer = awilix.createContainer();
repositoryContainer.register({
    logger: awilix.asValue(logger),
    db: awilix.asValue(dbConn),
});
repositoryContainer.loadModules(
    ['src/infrastructures/db/repository/**/!(*.test).js'],
    { formatName: 'camelCase' }
);
logger.log('repository', Object.keys(repositoryContainer.registrations));

const useCaseContainer = awilix.createContainer();
useCaseContainer.loadModules(
    [
        [
            'src/use-cases/**/!(*.test).js',
            {
                injector: () => containerToInjector(repositoryContainer),
            },
        ],
    ],
    {
        formatName: 'camelCase',
    }
);
logger.log('use case', Object.keys(useCaseContainer.registrations));

const rootContainer = awilix.createContainer();
rootContainer.register({
    logger: awilix.asValue(logger),
    dbConn: awilix.asValue(dbConn),
    routes: awilix.asFunction(makeRoutesAndHandlers),
});
rootContainer.loadModules(
    [
        [
            'src/interfaces/handler/*.js',
            {
                injector: () => containerToInjector(useCaseContainer),
            },
        ],
    ],
    {
        formatName: 'camelCase',
    }
);
logger.log('handler', Object.keys(rootContainer.registrations));

const dependencyInjection = rootContainer.cradle;

// main loop
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

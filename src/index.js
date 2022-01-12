require('dotenv').config();

const awilix = require('awilix');

// infrastructures
const logger = require('./infrastructures/logger');
const { createDbConnection } = require('./infrastructures/db');
const knexfile = require('./knexfile');
const createServer = require('./infrastructures/server');

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

// start http listener
const dependencyInjection = rootContainer.cradle;

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

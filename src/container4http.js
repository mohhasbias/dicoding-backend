const awilix = require('awilix');

// infrastructures
const logger = require('./infrastructures/logger');
const {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
} = require('./infrastructures/security/jwt');
const { createDbConnection } = require('./infrastructures/db');
const knexfile = require('./infrastructures/db/knexfile');

const envMap = {
    test: 'development',
};

const environment = envMap[process.env.NODE_ENV] || 'development';

const dbConfig = knexfile[environment];
const dbConn = createDbConnection(dbConfig, { logger });

// dependencies injection
const containerToInjector = (container) =>
    Object.keys(container.registrations).reduce(
        (acc, key) => ({ ...acc, [key]: container.resolve(key) }),
        {}
    );

const securityContainer = awilix.createContainer();
securityContainer.register({
    generateAccessToken: awilix.asValue(generateAccessToken),
    generateRefreshToken: awilix.asValue(generateRefreshToken),
    verifyAccessToken: awilix.asValue(verifyAccessToken),
    verifyRefreshToken: awilix.asValue(verifyRefreshToken),
});

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
                injector: () => ({
                    ...containerToInjector(repositoryContainer),
                    ...containerToInjector(securityContainer),
                }),
            },
        ],
    ],
    {
        formatName: 'camelCase',
    }
);

// interfaces
const makeRoutesAndHandlers = require('./interfaces/handler');

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

module.exports = rootContainer.cradle;

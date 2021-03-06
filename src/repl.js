require('dotenv').config();

const repl = require('repl');
const awilix = require('awilix');

// infrastructures
const logger = require('./infrastructures/logger');
const { createDbConnection } = require('./infrastructures/db');
const knexfile = require('./infrastructures/db/knexfile');

logger.silent = true;

const environment = process.env.NODE_ENV || 'development';
const dbConfig = knexfile[environment];
const dbConn = createDbConnection(dbConfig, { logger });

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
    currentUser: awilix.asValue({
        loggedIn: false,
        id: null,
        accessToken: null,
        refreshToken: null,
    }),
    verifyAccessToken: awilix.asValue(
        require('./use-cases/_utils').verifyAccessToken
    ),
});
rootContainer.loadModules(
    [
        [
            'src/interfaces/repl/!(index).js',
            {
                injector: () => containerToInjector(useCaseContainer),
            },
        ],
    ],
    {
        formatName: 'camelCase',
    }
);

// start repl session
const local = repl.start('node::forum-api> ');

const injectContainerToContext = (container, context) => {
    Object.keys(container.registrations).forEach(async (key) => {
        context[key] = container.resolve(key);
    });
};

const help = () => {
    console.log('Available command:');
    console.log(Object.keys(rootContainer.registrations).join('\n'));
};

help();

// inject features
local.context['hello'] = () => 'hello from repl';
local.context['help'] = help;

injectContainerToContext(rootContainer, local.context);

local.setupHistory('logs/repl-history.txt', () => {});

local.on('exit', () => {
    local.context.dbConn.conn().destroy();
});

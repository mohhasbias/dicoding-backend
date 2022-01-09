const { produce } = require('immer');

const createDbConnection = (config, { logger } = { logger: console }) => {
    logger.info(`${config.client}: ${config.connection.database}`);

    const knex = require('knex')(config);

    knex.on('query-error', function (error, obj) {
        logger.error('infrastructures: query error');
        logger.error(error.message);
    });

    return {
        user: () => knex('USERS'),
        authentications: () => knex('AUTHENTICATIONS'),
        threads: () => knex('THREADS'),
        comments: () => knex('COMMENTS'),
        replies: () => knex('REPLIES'),
        conn: () => knex,
    };
};

const createRepository = (dbConn, repository, options) => {
    const { logger } = options;

    return produce(repository, (draft) => {
        // attach method in repo to the db
        for (repo in repository) {
            for (method in repository[repo]) {
                draft[repo][method] = draft[repo][method]({ db: dbConn, logger });
            }
        }
    });
};

module.exports = {
    createDbConnection,
    createRepository,
};

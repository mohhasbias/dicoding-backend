const environment = process.env.ENVIRONMENT || 'development';
const config = require('./knexfile')[environment];
const logger = require('../logger');

logger.info(`${config.client}: ${config.connection.database}`);

const knex = require('knex')(config);

knex.on('query-error', function (error, obj) {
    logger.error('infrastructures: query error');
    logger.error(error.message);
});

module.exports = {
    user: () => knex('USERS'),
    authentications: () => knex('AUTHENTICATIONS'),
    threads: () => knex('THREADS'),
    comments: () => knex('COMMENTS'),
};

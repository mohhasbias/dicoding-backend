// const { createDbConnection } = require('./src/infrastructures/db');

// const environment = process.env.NODE_ENV || 'development';
// const config = require('./src/knexfile')[environment];

module.exports = async () => {
    // const db = createDbConnection(config);

    // await db.conn().raw('TRUNCATE TABLE "COMMENTS" CASCADE');
    // await db.conn().raw('TRUNCATE TABLE "THREADS" CASCADE');
    // await db.conn().raw('TRUNCATE TABLE "USERS" CASCADE');
    // await db.conn().raw('TRUNCATE TABLE "AUTHENTICATIONS" CASCADE');
};

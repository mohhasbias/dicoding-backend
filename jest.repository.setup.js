const db = require('./src/infrastructures/db');

module.exports = async () => {
    await db.conn().raw('TRUNCATE TABLE "COMMENTS" CASCADE');
    await db.conn().raw('TRUNCATE TABLE "THREADS" CASCADE');
    await db.conn().raw('TRUNCATE TABLE "USERS" CASCADE');
    await db.conn().raw('TRUNCATE TABLE "AUTHENTICATIONS" CASCADE');
};

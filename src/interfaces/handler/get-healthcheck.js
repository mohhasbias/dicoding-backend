const getHealthcheck =
    ({ dbConn }) =>
    async () => ({
        status: await dbConn.conn().raw('SELECT 1').then(() => 'up').catch(() => 'down'),
    });

module.exports = getHealthcheck;

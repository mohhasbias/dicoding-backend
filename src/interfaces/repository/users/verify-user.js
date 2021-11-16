const { hash } = require('../../_utils');

const verifyUser =
    ({ db, logger }) =>
    async (user) => {
        logger.info('interfaces: verify user');
        const { username } = user;
        logger.info(username);

        try {
            logger.info('verifying user');
            const result = await db
                .user()
                .where({
                    username,
                })
                .select(['id', 'password']);

            logger.info('num user: ' + result.length);

            return {
                isVerified: result.length === 1 && result[0].password === hash(user.password),
                id: result.length === 1 && result[0].id,
            };
        } catch (e) {
            logger.error('cannot verify user');
            e.isDB = true;
            throw e;
        }
    };

module.exports = verifyUser;

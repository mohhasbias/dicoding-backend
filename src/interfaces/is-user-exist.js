const isUserExist =
    ({ db, logger }) =>
    async (user) => {
        logger.info('interfaces: is user exist');
        const { username } = user;
        logger.info(username);

        try {
            logger.info('checking if user exist');
            const result = await db
                .user()
                .where({
                    username,
                })
                .select('username');

            logger.info('check count: ' + result.length);

            return result.length > 0;
        } catch (e) {
            logger.error('error check user exist');
            e.isDB = true;
            throw e;
        }
    };

module.exports = isUserExist;

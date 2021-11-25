const addRefreshToken =
    ({ db, logger }) =>
    async (refreshToken) => {
        logger.info('interfaces: add refresh token');

        try {
            const result = await db.authentications().insert({
                token: refreshToken,
            });

            logger.info('interfaces: refresh token added');

            return result[0];
        } catch (e) {
            logger.error('Error adding refresh token');
            e.isDB = true;
            throw e;
        }
    };

module.exports = addRefreshToken;

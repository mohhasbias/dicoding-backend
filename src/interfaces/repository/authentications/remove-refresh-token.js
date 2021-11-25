const removeRefreshToken =
    ({ db, logger }) =>
    async (refreshToken) => {
        logger.info('interfaces: remove refresh token');

        try {
            const result = await db
                .authentications()
                .where({
                    token: refreshToken,
                })
                .del();

            logger.info('interfaces: refresh token removed');

            return result[0];
        } catch (e) {
            logger.error('Error removing refresh token');
            e.isDB = true;
            throw e;
        }
    };

module.exports = removeRefreshToken;

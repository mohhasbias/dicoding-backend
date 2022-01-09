const isTokenExist =
    ({ db, logger }) =>
    async (refreshToken) => {
        logger.info('interfaces: is token exist');

        try {
            const result = await db.authentications().where({
                token: refreshToken,
            });

            return result.length === 1;
        } catch (e) {
            logger.error('Error checking is token exist');
            e.isDB = true;
            throw e;
        }
    };

module.exports = isTokenExist;

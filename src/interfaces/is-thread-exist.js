const isThreadExist =
    ({ db, logger }) =>
    async (threadId) => {
        logger.info('interfaces: is thread exist');

        try {
            logger.info('checking if thread exist');
            const result = await db
                .threads()
                .where({
                    id: threadId,
                })
                .select('id');

            logger.info('check count: ' + result.length);

            return result.length > 0;
        } catch (e) {
            logger.error('error check thread exist');
            e.isDB = true;
            throw e;
        }
    };

module.exports = isThreadExist;

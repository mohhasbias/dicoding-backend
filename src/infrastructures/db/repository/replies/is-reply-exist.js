const isReplyExist =
    ({ db, logger }) =>
    async (replyId) => {
        logger.info('interfaces: is reply exist');

        try {
            const result = await db.replies().where({
                id: replyId,
            });

            return result.length === 1;
        } catch (e) {
            logger.error('Error checking is reply exist');
            e.isDB = true;
            throw e;
        }
    };

module.exports = isReplyExist;

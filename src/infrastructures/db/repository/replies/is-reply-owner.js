const isReplyOwner =
    ({ db, logger }) =>
    async (replyId, userId) => {
        logger.info('interfaces: is reply owner');

        try {
            const result = await db.replies().where({
                id: replyId,
                owner: userId,
            });

            return result.length === 1;
        } catch (e) {
            logger.error('Error checking is reply owner');
            e.isDB = true;
            throw e;
        }
    };

module.exports = isReplyOwner;

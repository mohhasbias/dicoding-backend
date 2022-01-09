const delReply =
    ({ db, logger }) =>
    async (replyId) => {
        logger.info('infrastructure (repository): delete reply');

        try {
            const result = await db
                .replies()
                .where({
                    id: replyId,
                })
                .update({
                    is_delete: true,
                })
                .returning([
                    'id',
                    'content',
                    'owner',
                    'is_delete as isDelete',
                ]);

            return result[0];
        } catch (e) {
            logger.error('Error deleting reply');
            e.isDB = true;
            throw e;
        }
    };

module.exports = delReply;

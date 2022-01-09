const delComment =
    ({ db, logger }) =>
    async (commentId) => {
        logger.info('interfaces: delete comment');

        try {
            const result = await db
                .comments()
                .where({
                    id: commentId,
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
            logger.error('Error deleting comment');
            e.isDB = true;
            throw e;
        }
    };

module.exports = delComment;

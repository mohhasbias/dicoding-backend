const delComment =
    ({ db, logger }) =>
    async (commentId, deleteContent) => {
        logger.info('interfaces: delete comment');

        try {
            const result = await db
                .comments()
                .where({
                    id: commentId,
                })
                .update({
                    is_delete: true,
                    content: deleteContent,
                })
                .returning(['id', 'content', 'owner']);

            return result[0];
        } catch (e) {
            logger.error('Error deleting comment');
            e.isDB = true;
            throw e;
        }
    };

module.exports = delComment;

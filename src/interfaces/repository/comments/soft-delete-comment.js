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
                    delete_content: deleteContent, // untuk support **komentar telah dihapus** dan **balasan telah dihapus**
                })
                .returning([
                    'id',
                    'content',
                    'owner',
                    'is_delete as isDelete',
                    'delete_content as deleteContent',
                ]);

            return result[0];
        } catch (e) {
            logger.error('Error deleting comment');
            e.isDB = true;
            throw e;
        }
    };

module.exports = delComment;

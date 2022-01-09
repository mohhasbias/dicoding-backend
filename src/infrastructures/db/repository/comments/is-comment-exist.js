const isCommentExist =
    ({ db, logger }) =>
    async (commentId) => {
        logger.info('interfaces: is comment exist');

        try {
            const result = await db.comments().where({
                id: commentId,
            });

            return result.length === 1;
        } catch (e) {
            logger.error('Error checking is comment exist');
            e.isDB = true;
            throw e;
        }
    };

module.exports = isCommentExist;

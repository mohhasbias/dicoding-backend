const isCommentOwner =
    ({ db, logger }) =>
    async (commentId, userId) => {
        logger.info('interfaces: is comment owner');

        try {
            const result = await db.comments().where({
                id: commentId,
                owner: userId,
            });

            return result.length === 1;
        } catch (e) {
            logger.error('Error checking is comment owner');
            e.isDB = true;
            throw e;
        }
    };

module.exports = isCommentOwner;

const isCommentExist =
    ({ db, logger }) =>
    async (commentId) => {
        logger.info('interfaces: is comment exist');

        try {
            const result = await db.comments().where({
                id: commentId,
            });

            console.log(result);

            return result.length === 1;
        } catch (e) {
            console.log('Error checking is comment exist');
            e.isDB = true;
            throw e;
        }
    };

module.exports = isCommentExist;

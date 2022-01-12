const deleteComments =
    ({ isThreadExist, isCommentExist, isCommentOwner, softDeleteComment, logger }) =>
    async (threadId, commentsId, userId) => {
        logger.info('use case: delete comments');

        if (!await isThreadExist(threadId)) {
            const err = new Error('Thread tidak exist');
            err.isDB = true;
            throw err;
        }

        if (!await isCommentExist(commentsId)) {
            const err = new Error('Comment tidak exist');
            err.isDB = true;
            throw err;
        }

        if (!await isCommentOwner(commentsId, userId)) {
            const err = new Error('Invalid comment owner');
            err.isDB = true;
            throw err;
        }

        await softDeleteComment(commentsId);

        return true;
    };

module.exports = deleteComments;

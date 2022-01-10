const deleteCommentReply =
    ({ isThreadExist, isCommentExist, isReplyExist, isReplyOwner, softDeleteReply, logger }) =>
    async (threadId, commentsId, replyId, userId) => {
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

        if (!await isReplyExist(replyId)) {
            const err = new Error('Reply tidak exist');
            err.isDB = true;
            throw err;
        }

        if (!await isReplyOwner(replyId, userId)) {
            const err = new Error('Invalid reply owner');
            err.isDB = true;
            throw err;
        }

        await softDeleteReply(replyId);
    };

module.exports = deleteCommentReply;

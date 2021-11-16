const deleteCommentReply =
    ({ isThreadExist, isCommentExist, isCommentOwner, softDeleteComment, logger }) =>
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

        if (!await isCommentExist(replyId)) {
            const err = new Error('Reply tidak exist');
            err.isDB = true;
            throw err;
        }

        if (!await isCommentOwner(replyId, userId)) {
            const err = new Error('Invalid reply owner');
            err.isDB = true;
            throw err;
        }

        await softDeleteComment(replyId, '**balasan telah dihapus**');

        return true;
    };

module.exports = deleteCommentReply;

const deleteCommentReply =
    ({ deleteCommentReply, verifySession, currentUser, logger }) =>
    async (threadId, commentId, replyId) => {
        logger.info('interfaces: delete comment reply');

        await verifySession();

        // extract repl input
        const userId = currentUser.id;

        // call use cases
        await deleteCommentReply(threadId, commentId, replyId, userId);

        // build repl output
        return {
            status: 'success',
        };
    };

module.exports = deleteCommentReply;

const deleteComment =
    ({ deleteComment, verifySession, currentUser, logger }) =>
    async (threadId, commentId) => {
        logger.info('interfaces: delete comments');

        await verifySession();

        const userId = currentUser.id;

        // call use cases
        await deleteComment(threadId, commentId, userId);

        // build repl response
        return {
            status: 'success',
        };
    };

module.exports = deleteComment;

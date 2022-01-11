const deleteCommentReplyHandler =
    ({ deleteCommentReply, logger }) =>
    async (req, h) => {
        logger.info('interfaces: delete comment reply');
        // extract http request
        const { threadId, commentId, replyId } = req.params;
        const userId = req.auth.credentials.id;

        // call use cases
        await deleteCommentReply(threadId, commentId, replyId, userId);

        // build http response
        return {
            status: 'success',
        };
    };

module.exports = deleteCommentReplyHandler;

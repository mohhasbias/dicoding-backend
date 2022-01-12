const deleteCommentHandler =
    ({ deleteComment, logger }) =>
    async (req, h) => {
        logger.info('interfaces: delete comments');

        // extract http request
        const { threadId, commentId } = req.params;
        const userId = req.auth.credentials.id;

        // call use cases
        await deleteComment(threadId, commentId, userId);

        // build http response
        return {
            status: 'success',
        };
    };

module.exports = deleteCommentHandler;

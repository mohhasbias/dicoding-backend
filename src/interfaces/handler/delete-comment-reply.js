const deleteCommentReply = require('../../use-cases/delete-comment-reply');

const deleteCommentReplyHandler =
    ({ repository }, { logger }) =>
    async (req, h) => {
        logger.info('interfaces: delete comment reply');
        // extract http request
        const { threadId, commentId, replyId } = req.params;
        const userId = req.auth.credentials.id;

        // inject services
        const injectedServices = {
            isThreadExist: repository.threads.isThreadExist,
            isCommentExist: repository.comments.isCommentExist,
            isReplyExist: repository.replies.isReplyExist,
            isReplyOwner: repository.replies.isReplyOwner,
            softDeleteReply: repository.replies.softDeleteReply,
            logger,
        };

        // call use cases
        await deleteCommentReply(injectedServices)(
            threadId,
            commentId,
            replyId,
            userId
        );

        // build http response
        return {
            status: 'success',
        };
    };

module.exports = deleteCommentReplyHandler;

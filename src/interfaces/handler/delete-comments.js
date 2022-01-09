const deleteComments = require('../../use-cases/delete-comments');

const deleteCommentsHandler =
    ({ repository }, { logger }) =>
    async (req, h) => {
        logger.info('interfaces: delete comments');

        // extract http request
        const { threadId, commentId } = req.params;
        const userId = req.auth.credentials.id;

        // inject services
        const injectedServices = {
            isThreadExist: repository.threads.isThreadExist,
            isCommentExist: repository.comments.isCommentExist,
            isCommentOwner: repository.comments.isCommentOwner,
            softDeleteComment: repository.comments.softDeleteComment,
            logger,
        };

        // call use cases
        await deleteComments(injectedServices)(threadId, commentId, userId);

        // build http response
        return {
            status: 'success',
        };
    };

module.exports = deleteCommentsHandler;

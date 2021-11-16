const deleteCommentReply = require('../../use-cases/delete-comment-reply');

const isThreadExist = require('../repository/threads/is-thread-exist');
const isCommentExist = require('../repository/comments/is-comment-exist');
const isCommentOwner = require('../repository/comments/is-comment-owner');
const softDeleteComment = require('../repository/comments/soft-delete-comment');

const deleteCommentsHandler = (services) => async (req, h) => {
    const { logger } = services;
    logger.info('interfaces: delete comment reply');
    // extract http request
    const { threadId, commentId, replyId } = req.params;
    const userId = req.auth.credentials.id;

    // injectedServices
    const injectedServices = {
        ...services,
        isThreadExist: isThreadExist(services),
        isCommentExist: isCommentExist(services),
        isCommentOwner: isCommentOwner(services),
        softDeleteComment: softDeleteComment(services),
    };

    // call use cases
    await deleteCommentReply(injectedServices)(threadId, commentId, replyId, userId);

    // build http response
    return h
        .response({
            status: 'success',
        })
        .code(200);
};

module.exports = deleteCommentsHandler;

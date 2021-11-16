const commentReply = require('../../use-cases/comment-reply');

const isThreadExist = require('../repository/threads/is-thread-exist');
const isCommentExist = require('../repository/comments/is-comment-exist');
const insertCommentReply = require('../repository/comments/insert-comment-reply');

const postCommentReply = (services) => async (req, h) => {
    const { logger } = services;
    logger.info('interfaces: post comment reply');

    const threadId = req.params.threadId;
    const commentId = req.params.commentId;
    const comment = {
        ...req.payload,
        owner: req.auth.credentials.id,
        thread: threadId,
    };

    const injectedServices = {
        ...services,
        isThreadExist: isThreadExist(services),
        isCommentExist: isCommentExist(services),
        insertCommentReply: insertCommentReply(services),
    };

    const addedCommentReply = await commentReply(injectedServices)(
        threadId,
        commentId,
        comment
    );

    return h
        .response({
            status: 'success',
            data: {
                addedReply: addedCommentReply
            },
        })
        .code(201);
};

module.exports = postCommentReply;

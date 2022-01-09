const commentReply = require('../../use-cases/comment-reply');

const postCommentReply =
    ({ repository }, { logger }) =>
    async (req, h) => {
        logger.info('interfaces: post comment reply');

        const { threadId, commentId } = req.params;

        const reply = {
            ...req.payload,
            owner: req.auth.credentials.id,
            thread: threadId,
        };

        const injectedServices = {
            isThreadExist: repository.threads.isThreadExist,
            isCommentExist: repository.comments.isCommentExist,
            insertReply: repository.replies.insertReply,
            logger,
        };

        const addedCommentReply = await commentReply(injectedServices)(
            threadId,
            commentId,
            reply
        );

        return h
            .response({
                status: 'success',
                data: {
                    addedReply: addedCommentReply,
                },
            })
            .code(201);
    };

module.exports = postCommentReply;

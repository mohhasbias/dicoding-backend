const postCommentReply =
    ({ commentReply, logger }) =>
    async (req, h) => {
        logger.info('interfaces: post comment reply');

        const { threadId, commentId } = req.params;

        const reply = {
            ...req.payload,
            owner: req.auth.credentials.id,
            thread: threadId,
        };

        const addedCommentReply = await commentReply(
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

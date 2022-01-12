const addCommentReply =
    ({ commentReply, verifySession, currentUser, logger }) =>
    async (threadId, commentId, payload) => {
        logger.info('interfaces: add comment reply');

        await verifySession();

        const reply = {
            ...payload,
            owner: currentUser.id,
            thread: threadId,
        };

        const addedCommentReply = await commentReply(
            threadId,
            commentId,
            reply
        );

        return {
            status: 'success',
            data: {
                addedReply: addedCommentReply,
            },
        };
    };

module.exports = addCommentReply;

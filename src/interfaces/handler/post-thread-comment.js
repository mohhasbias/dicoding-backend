const postThreadComment =
    ({ addThreadComment, logger }) =>
    async (req, h) => {
        logger.info('interfaces: post thread');

        const threadId = req.params.threadId;
        const userId = req.auth.credentials.id;
        const comment = {
            ...req.payload,
            owner: userId,
        };

        const addedThreadComment = await addThreadComment(threadId, comment);

        return h
            .response({
                status: 'success',
                data: {
                    addedComment: addedThreadComment,
                },
            })
            .code(201);
    };

module.exports = postThreadComment;

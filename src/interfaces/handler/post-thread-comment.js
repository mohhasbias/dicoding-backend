const postThreadComment =
    ({ addThreadComment, logger }) =>
    async (req, h) => {
        logger.info('interfaces: post thread');

        const threadId = req.params.threadId;
        const comment = {
            ...req.payload,
            owner: req.auth.credentials.id,
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

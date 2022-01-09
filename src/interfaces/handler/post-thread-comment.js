const addThreadComment = require('../../use-cases/add-thread-comment');

const postThreadComment =
    ({ repository }, { logger }) =>
    async (req, h) => {
        logger.info('interfaces: post thread');

        const threadId = req.params.threadId;
        const comment = {
            ...req.payload,
            owner: req.auth.credentials.id,
        };

        const injectedServices = {
            isThreadExist: repository.threads.isThreadExist,
            insertComment: repository.comments.insertComment,
            logger,
        };

        const addedThreadComment = await addThreadComment(injectedServices)(
            threadId,
            comment
        );

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

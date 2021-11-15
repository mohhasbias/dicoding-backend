const addThreadComment = require('../use-cases/add-thread-comment');

const postThreadComment = (services) => async (req, h) => {
    const { logger } = services;
    logger.info('interfaces: post thread');

    const comment = {
        ...req.payload,
        owner: req.auth.credentials.id,
    };

    const addedThreadComment = await addThreadComment(
        req.params.threadId,
        comment,
        services
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

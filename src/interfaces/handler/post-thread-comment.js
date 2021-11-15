const addThreadComment = require('../../use-cases/add-thread-comment');

const isThreadExist = require('../repository/threads/is-thread-exist');
const insertComment = require('../repository/comments/insert-comment');

const postThreadComment = (services) => async (req, h) => {
    const { logger } = services;
    logger.info('interfaces: post thread');

    const threadId = req.params.threadId;
    const comment = {
        ...req.payload,
        owner: req.auth.credentials.id,
    };

    const injectedServices = {
        ...services,
        isThreadExist: isThreadExist(services),
        insertComment: insertComment(services),
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

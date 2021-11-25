// use cases
const getComments = require('../../use-cases/get-comments');

// relevant interfaces
const isThreadExist = require('../repository/threads/is-thread-exist');
const queryThreadComments = require('../repository/comments/query-thread-comments');

const getCommentsHandler = (services) => async (req, h) => {
    const { logger } = services;
    logger.info('interfaces: get comments');
    // extract http request
    const threadId = req.params.threadId;

    // inject services (infrastructures) to use case
    const injectedServices = {
        ...services,
        isThreadExist: isThreadExist(services),
        queryThreadComments: queryThreadComments(services),
    };

    // call use cases
    const threadWithComments = await getComments(injectedServices)(threadId);

    // build http response
    return h
        .response({
            status: 'success',
            data: {
                thread: threadWithComments,
            },
        })
        .code(200);
};

module.exports = getCommentsHandler;

// use cases
const getComments = require('../../use-cases/get-comments');

// relevant interfaces
const isThreadExist = require('../repository/threads/is-thread-exist');
const selectThread = require('../repository/threads/select-thread');
const selectComment = require('../repository/comments/select-comment');

const getCommentsHandler = (services) => async (req, h) => {
    const { logger } = services;
    logger.info('interfaces: get comments');

    // extract http request
    const threadId = req.params.threadId;

    // inject services (infrastructures) to use case
    const injectedServices = {
        ...services,
        isThreadExist: isThreadExist(services),
        selectThread: selectThread(services),
        selectComment: selectComment(services),
    };

    // call use cases
    const threadWithComments = await getComments(injectedServices)(threadId);

    // build http response
    return {
        status: 'success',
        data: {
            thread: threadWithComments,
        },
    };
};

module.exports = getCommentsHandler;

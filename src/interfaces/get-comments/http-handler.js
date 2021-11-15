// use cases
const getComments = require('../../use-cases/get-comments');

// relevant interfaces
const isThreadExist = require('../is-thread-exist');
const queryThreadComments = require('./query-thread-comments');

const httpHandler =
    (services) =>
    async (req, h) => {
        const { logger } = services;
        logger.info('interfaces: get comments');
        // extract http request
        const threadId = req.params.threadId;

        // call use cases
        const threadWithComments = await getComments(
            threadId,
            isThreadExist(services),
            queryThreadComments(services)
        );

        console.log(threadWithComments);

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

module.exports = httpHandler;

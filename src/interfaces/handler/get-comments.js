// use cases
const getComments = require('../../use-cases/get-comments');

const getCommentsHandler =
    ({ repository }, { logger }) =>
    async (req, h) => {
        logger.info('interfaces: get comments');

        // extract http request
        const threadId = req.params.threadId;

        // inject services (infrastructures) to use case
        const injectedServices = {
            isThreadExist: repository.threads.isThreadExist,
            selectThread: repository.threads.selectThread,
            selectComments: repository.comments.selectComments,
            selectReplies: repository.replies.selectReplies,
            logger,
        };

        // call use cases
        const threadWithComments = await getComments(injectedServices)(
            threadId
        );

        // build http response
        return {
            status: 'success',
            data: {
                thread: threadWithComments,
            },
        };
    };

module.exports = getCommentsHandler;

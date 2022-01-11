const getThreadHandler =
    ({ getComments, logger }) =>
    async (req, h) => {
        logger.info('interfaces: get thread with comments');

        // extract http request
        const threadId = req.params.threadId;

        console.log(threadId);

        // call use cases
        const threadWithComments = await getComments(threadId);

        // build http response
        return {
            status: 'success',
            data: {
                thread: threadWithComments,
            },
        };
    };

module.exports = getThreadHandler;

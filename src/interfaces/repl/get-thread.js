const getThread =
    ({ getComments, logger }) =>
    async (threadId) => {
        logger.info('interfaces: get thread with comments');

        // call use cases
        const threadWithComments = await getComments(threadId);

        return {
            status: 'success',
            data: {
                thread: threadWithComments,
            },
        };
    };

module.exports = getThread;

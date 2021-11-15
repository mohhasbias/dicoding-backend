const getComments =
    ({ isThreadExist, queryThreadComments, logger }) =>
    async (threadId) => {
        logger.info('use case: get comments');
        const isExist = await isThreadExist(threadId);
        if (!isExist) {
            const err = new Error('Thread tidak exist');
            err.isDB = true;
            throw err;
        }

        const threadWithComments = await queryThreadComments(threadId);

        return threadWithComments;
    };

module.exports = getComments;

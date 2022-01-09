const getComments =
    ({ isThreadExist, selectThread, selectComments, selectReplies, logger }) =>
    async (threadId) => {
        logger.info('use case: get comments');
        const isExist = await isThreadExist(threadId);
        if (!isExist) {
            const err = new Error('Thread tidak exist');
            err.isDB = true;
            throw err;
        }

        const threadInfo = await selectThread(threadId);

        const comments = await selectComments(threadId);

        const replies = await selectReplies(threadId);

        const commentsReplies = comments.map((c) => {
            return {
                ...c,
                replies: replies.filter((x) => x.comment === c.id),
            };
        });

        const threadWithComments = {
            ...threadInfo,
            comments: commentsReplies,
        };

        return threadWithComments;
    };

module.exports = getComments;

const extractComment = ({
    id,
    username,
    date,
    content,
    isDelete,
    deleteContent,
}) => ({
    id,
    username,
    date,
    content: isDelete ? deleteContent : content,
});

const getComments =
    ({
        isThreadExist,
        selectThread,
        selectComment,
        logger,
    }) =>
    async (threadId) => {
        logger.info('use case: get comments');
        const isExist = await isThreadExist(threadId);
        if (!isExist) {
            const err = new Error('Thread tidak exist');
            err.isDB = true;
            throw err;
        }

        const threadInfo = await selectThread(threadId);

        const comments = await selectComment(threadId);

        const headComments = comments.filter((c) => !c.replyTo);

        const commentsReplies = headComments.map((c) => {
            return {
                ...extractComment(c),
                replies: comments
                    .filter((x) => x.replyTo === c.id)
                    .map(extractComment),
            };
        });

        const threadWithComments = {
            ...threadInfo,
            comments: commentsReplies,
        };

        return threadWithComments;
    };

module.exports = getComments;

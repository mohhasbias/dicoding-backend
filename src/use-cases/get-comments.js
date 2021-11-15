const getComments = (threadId, isThreadExist, queryThreadComments) => {
    const isExist = isThreadExist(threadId);
    if (!isExist) {
        const err = new Error('Thread tidak exist');
        err.isDB = true;
        throw err;
    }

    const threadWithComments = queryThreadComments(threadId);

    return threadWithComments;
};

module.exports = getComments;

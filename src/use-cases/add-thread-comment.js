const newComment = require('../entities/comment');

const addThreadComment = async (threadId, comment, { db, logger }) => {
    logger.info('use cases: add thread comment');

    const validatedComment = newComment({
        thread: threadId,
        ...comment
    });

    const isThreadExist = await db.isThreadExist(threadId);
    if(!isThreadExist) {
        const err = new Error('Thread tidak exist');
        err.isDB = true;
        throw err;
    }

    const addedComment = await db.insertComment(validatedComment);

    return addedComment;
};

module.exports = addThreadComment;

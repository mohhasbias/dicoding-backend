// entities 
const newComment = require('../entities/comment');

const addThreadComment =
    ({ isThreadExist, insertComment, logger }) =>
    async (threadId, comment) => {
        logger.info('use cases: add thread comment');

        const validatedComment = newComment({
            thread: threadId,
            ...comment,
        });

        const isExist = await isThreadExist(threadId);
        if (!isExist) {
            const err = new Error('Thread tidak exist');
            err.isDB = true;
            throw err;
        }

        const addedComment = await insertComment(validatedComment);

        return addedComment;
    };

module.exports = addThreadComment;

const newComment = require('../entities/comment');

const commentReply =
    ({ isThreadExist, isCommentExist, insertReply, logger }) =>
    async (threadId, commentId, reply) => {
        logger.info('use cases: comment reply');

        const isExist = await isThreadExist(threadId);
        if (!isExist) {
            const err = new Error('Thread tidak exist');
            err.isDB = true;
            throw err;
        }

        if (!await isCommentExist(commentId)) {
            const err = new Error('Comment tidak exist');
            err.isDB = true;
            throw err;
        }

        const validatedReply = newComment(reply);

        const addedCommentReply = await insertReply(commentId, validatedReply);        

        return addedCommentReply;
    };

module.exports = commentReply;

const newComment = require('../entities/comment');

const commentReply =
    ({ isThreadExist, isCommentExist, insertCommentReply, logger }) =>
    async (threadId, commentId, comment) => {
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

        const validatedComment = newComment(comment);

        const addedCommentReply = await insertCommentReply(commentId, validatedComment);        

        return addedCommentReply;
    };

module.exports = commentReply;

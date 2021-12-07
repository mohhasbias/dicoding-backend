const selectThread = require('../threads/select-thread');
const selectComment = require('./select-comment');

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

const queryThreadComments =
    ({ db, logger }) =>
    async (threadId) => {
        logger.info('interfaces: query thread comments');

        try {
            const thread = await selectThread({ db, logger })(threadId);

            const comments = await selectComment({ db, logger })(threadId);

            const headComments = comments.filter((c) => !c.replyTo);

            const commentsReplies = headComments.map((c) => {
                return {
                    ...extractComment(c),
                    replies: comments
                        .filter((x) => x.replyTo === c.id)
                        .map(extractComment),
                };
            });

            const result = {
                ...thread,
                comments: commentsReplies,
            };

            return result;
        } catch (e) {
            logger.error('Error query thread comments');
            e.isDB = true;
            throw e;
        }
    };

module.exports = queryThreadComments;

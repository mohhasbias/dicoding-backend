const { generateID } = require('../../_utils');

const insertCommentReply =
    ({ db, logger }) =>
    async (commentId, comment) => {
        logger.info('interfaces: insert comment reply');

        try {
            const id = await generateID();
            const result = await db
                .comments()
                .insert({
                    id,
                    reply_to: commentId,
                    ...comment,
                })
                .returning(['id', 'content', 'owner']);

            logger.info('interfaces: comment reply inserted');
            logger.info(JSON.stringify(result[0], null, 2));

            return result[0];
        } catch (e) {
            logger.error('Error insert comment reply');
            e.isDB = true;
            throw e;
        }
    };

module.exports = insertCommentReply;

const { generateID } = require('../_utils');

const insertReply =
    ({ db, logger }) =>
    async (commentId, reply) => {
        logger.info('infrastructure (repository): insert reply');

        try {
            const id = await generateID();
            const result = await db
                .replies()
                .insert({
                    id,
                    comment: commentId,
                    ...reply,
                })
                .returning(['id', 'content', 'owner']);

            logger.info('interfaces: reply inserted');
            logger.info(JSON.stringify(result[0], null, 2));

            return result[0];
        } catch (e) {
            logger.error('Error insert reply');
            e.isDB = true;
            throw e;
        }
    };

module.exports = insertReply;

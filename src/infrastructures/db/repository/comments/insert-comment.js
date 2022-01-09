const { generateID } = require('../_utils');

const insertComment =
    ({ db, logger }) =>
    async (comment) => {
        logger.info('interfaces: insert comment');

        try {
            const id = await generateID();
            const result = await db
                .comments()
                .insert({
                    id,
                    ...comment,
                })
                .returning(['id', 'content', 'owner']);

            logger.info('interfaces: comment inserted');
            logger.info(JSON.stringify(result[0], null, 2));

            return result[0];
        } catch (e) {
            logger.error('Error insert comment');
            e.isDB = true;
            throw e;
        }
    };

module.exports = insertComment;

const { generateID } = require('../../_utils');

const insertThread =
    ({ db, logger }) =>
    async (thread) => {
        logger.info('interfaces: insert thread');

        try {
            const id = await generateID();
            const result = await db
                .threads()
                .insert({
                    id,
                    ...thread,
                })
                .returning(['id', 'title', 'owner']);

            logger.info('interfaces: user inserted');
            logger.info(JSON.stringify(result[0], null, 2));

            return result[0];
        } catch (e) {
            logger.error('Error insert thread');
            e.isDB = true;
            throw e;
        }
    };

module.exports = insertThread;

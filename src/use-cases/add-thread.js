// entities 
const newThread = require('../entities/thread');

// use case
const addThread =
    ({ insertThread, logger }) =>
    async (owner, thread) => {
        logger.info('use cases: add thread');

        const validatedThread = newThread({
            owner,
            ...thread,
        });

        const addedThread = await insertThread(validatedThread);

        return addedThread;
    };

module.exports = addThread;

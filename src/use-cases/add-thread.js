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

        return insertThread(validatedThread);
    };

module.exports = addThread;

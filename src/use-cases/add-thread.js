const newThread = require('../entities/thread');

const addThread = async (owner, thread, { db, logger }) => {
    logger.info('use cases: add thread');

    const validatedThread = newThread({
        owner,
        ...thread,
    });

    const addedThread = await db.insertThread(validatedThread);

    return addedThread;
};

module.exports = addThread;

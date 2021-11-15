const addThread = require('../../use-cases/add-thread');

const insertThread = require('../repository/threads/insert-thread');

const postThread = (services) => async (req, h) => {
    const { logger } = services;
    logger.info('interfaces: post thread');

    const owner = req.auth.credentials.id;
    const thread = req.payload;

    const injectedServices = {
        ...services,
        insertThread: insertThread(services),
    };

    const addedThread = await addThread(injectedServices)(owner, thread);

    return h
        .response({
            status: 'success',
            data: {
                addedThread,
            },
        })
        .code(201);
};

module.exports = postThread;

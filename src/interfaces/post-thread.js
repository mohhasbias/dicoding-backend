const addThread = require('../use-cases/add-thread');

const postThread = (services) => async (req, h) => {
    const { logger } = services;
    logger.info('interfaces: post thread');
    const addedThread = await addThread(req.auth.credentials.id, req.payload, services);

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

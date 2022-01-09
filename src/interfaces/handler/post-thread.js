const addThread = require('../../use-cases/add-thread');

const postThread =
    ({ repository }, { logger }) =>
    async (req, h) => {
        logger.info('interfaces: post thread');

        const owner = req.auth.credentials.id;
        const thread = req.payload;

        const injectedServices = {
            insertThread: repository.threads.insertThread,
            logger,
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

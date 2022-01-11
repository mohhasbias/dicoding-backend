const postThread =
    ({ addThread, logger }) =>
    async (req, h) => {
        logger.info('interfaces: post thread');

        const owner = req.auth.credentials.id;
        const thread = req.payload;

        const addedThread = await addThread(owner, thread);

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

const addThread =
    ({ addThread, verifySession, currentUser, logger }) =>
    async (thread) => {
        logger.info('interfaces: add thread');

        await verifySession();

        const owner = currentUser.id;

        const addedThread = await addThread(owner, thread);

        return {
            status: 'success',
            data: {
                addedThread,
            },
        };
    };

module.exports = addThread;

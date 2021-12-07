const selectThread =
    ({ db, logger }) =>
    async (threadId) => {
        logger.info('interfaces: select thread');
        
        try {
            const [thread] = await db
                .conn()
                .select([
                    'THREADS.id as id',
                    'title',
                    'body',
                    'THREADS.created_at as date',
                    'username',
                ])
                .from('THREADS')
                .leftJoin('USERS', 'USERS.id', 'owner')
                .where({
                    'THREADS.id': threadId,
                });

            return thread;
        } catch (e) {
            logger.error('Error query thread comments');
            e.isDB = true;
            throw e;
        }
    };

module.exports = selectThread;

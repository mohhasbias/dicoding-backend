const queryThreadComments =
    ({ db, logger }) =>
    async (threadId) => {
        logger.info('interfaces: query thread comments');

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

        const comments = await db
            .conn()
            .select([
                'THREADS.id as threadId',
                'COMMENTS.id as id',
                'username',
                'COMMENTS.created_at as date',
                'content',
            ])
            .from('THREADS')
            .leftJoin('COMMENTS', 'THREADS.id', 'COMMENTS.thread')
            .join('USERS', 'COMMENTS.owner', 'USERS.id')
            .where({
                thread: threadId,
            })
            .orderBy('date');

        const result = {
            ...thread,
            comments,
        };

        return result;
    };

module.exports = queryThreadComments;

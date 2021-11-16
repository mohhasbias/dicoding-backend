const queryThreadComments =
    ({ db, logger }) =>
    async (threadId) => {
        logger.info('interfaces: query thread comments');

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

            const comments = await db
                .conn()
                .select([
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
                    reply_to: null,
                })
                .orderBy('date');

            const commentsReplies = await Promise.all(
                comments.map(async (c) => {
                    const replies = await db
                        .conn()
                        .select([
                            'COMMENTS.id as id',
                            'username',
                            'COMMENTS.created_at as date',
                            'content',
                        ])
                        .from('COMMENTS')
                        .join('USERS', 'COMMENTS.owner', 'USERS.id')
                        .where({
                            thread: threadId,
                            reply_to: c.id,
                        })
                        .orderBy('date');
                    return {
                        ...c,
                        replies,
                    };
                })
            );

            const result = {
                ...thread,
                comments: commentsReplies,
            };

            return result;
        } catch (e) {
            console.log('Error query thread comments');
            e.isDB = true;
            throw e;
        }
    };

module.exports = queryThreadComments;

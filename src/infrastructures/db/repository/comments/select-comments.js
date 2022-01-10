const selectComments =
    ({ db, logger }) =>
    async (threadId) => {
        logger.info('infrastructures (repository): select comments');

        try {
            const comments = await db
                .conn()
                .select([
                    'COMMENTS.id as id',
                    'username',
                    'COMMENTS.created_at as date',
                    'content',
                    'is_delete as isDelete',
                ])
                .from('COMMENTS')
                .join('USERS', 'COMMENTS.owner', 'USERS.id')
                .where({
                    thread: threadId,
                })
                .orderBy('date');

            return comments;
        } catch (e) {
            logger.error('Error query thread comments');
            e.isDB = true;
            throw e;
        }
    };

module.exports = selectComments;

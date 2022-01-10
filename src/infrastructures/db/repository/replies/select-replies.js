const selectReplies =
    ({ db, logger }) =>
    async (threadId) => {
        logger.info('infrastructures (repository): select replies');

        try {
            const replies = await db
                .conn()
                .select([
                    'REPLIES.id as id',
                    'username',
                    'REPLIES.created_at as date',
                    'content',
                    'is_delete as isDelete',
                    'comment',
                ])
                .from('REPLIES')
                .join('USERS', 'REPLIES.owner', 'USERS.id')
                .where({
                    thread: threadId,
                })
                .orderBy('date');

            return replies;
        } catch (e) {
            logger.error('Error query thread replies');
            e.isDB = true;
            throw e;
        }
    };

module.exports = selectReplies;

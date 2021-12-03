const addThreadComment = require('./add-thread-comment');

describe('Add Thread Comment', () => {
    it('should add comment to an existing thread', async () => {
        const mockService = {
            isThreadExist: () => Promise.resolve(true),
            insertComment: (comment) => Promise.resolve(comment),
            logger: {
                info: () => {},
            },
        };

        const comment = {
            owner: 'owner id',
            content: 'a comment',
        };

        const threadId = 'threadId';

        const result = await addThreadComment(mockService)(threadId, comment);

        expect(result).toEqual({
            thread: threadId,
            ...comment,
        });
    });

    it('should reject comment to an inexisting thread', () => {
        const mockService = {
            isThreadExist: () => Promise.resolve(false),
            insertComment: (comment) => Promise.resolve(comment),
            logger: {
                info: () => {},
            },
        };

        const comment = {
            owner: 'owner id',
            content: 'a comment',
        };

        const threadId = 'threadId';

        addThreadComment(mockService)(threadId, comment).catch((e) => {
            expect(e).toHaveProperty('isDB');
        });
    });
});

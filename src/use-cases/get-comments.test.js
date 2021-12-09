const getComments = require('./get-comments');

const { extractComment } = require('../interfaces/repository/comments/_utils');

describe('get comments', () => {
    it('should get comments', async () => {
        const threadInfo = {
            id: 'threadId',
            title: 'thread title',
            body: 'thread body',
            date: new Date(),
            username: 'thread username',
        };

        const comments = [
            {
                id: 'commentId',
                username: 'comment username',
                date: new Date(),
                content: 'comment content',
                isDelete: false,
                deleteContent: null,
                replyTo: null,
            },
            {
                id: 'commentId',
                username: 'comment username',
                date: new Date(),
                content: 'comment reply content',
                isDelete: false,
                deleteContent: null,
                replyTo: 'commentId',
            }
        ]

        const mockService = {
            isThreadExist: jest.fn().mockResolvedValue(true),
            selectThread: jest.fn().mockResolvedValue(threadInfo),
            selectComment: jest.fn().mockResolvedValue(comments),
            extractComment,
            logger: { info: () => {} },
        };

        const result = await getComments(mockService)(threadInfo.id);

        expect(result).toHaveProperty('title');
        expect(result).toHaveProperty('body');
        expect(result).toHaveProperty('username');

        expect(result.comments.length).toBe(1);
        expect(result.comments[0]).toHaveProperty('username');
        expect(result.comments[0]).toHaveProperty('content');
        expect(result.comments[0]).toHaveProperty('replies');

        expect(result.comments[0].replies.length).toBe(1);
        expect(result.comments[0].replies[0]).toHaveProperty('username');
        expect(result.comments[0].replies[0]).toHaveProperty('content');
    });

    it('should reject non existent thread', async () => {
        const mockService = {
            isThreadExist: () => Promise.resolve(false),
            logger: { info: () => {} },
        };

        await getComments(mockService)().catch((e) => {
            expect(e).toHaveProperty('isDB');
        });
    });
});

const getComments = require('./get-comments');

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
                id: 'commentId1',
                username: 'comment username',
                date: new Date(),
                content: 'comment content',
                isDelete: false,
            },
            {
                id: 'commentId2',
                username: 'comment username',
                date: new Date(),
                content: 'another comment content',
                isDelete: true,
            },
        ];

        const replies = [
            {
                id: 'replyId1',
                username: 'reply username',
                date: new Date(),
                content: 'reply content',
                isDelete: false,
                comment: 'commentId1',
            },
            {
                id: 'replyId2',
                username: 'reply username',
                date: new Date(),
                content: 'another reply content',
                isDelete: true,
                comment: 'commentId1',
            },
        ];

        const mockService = {
            isThreadExist: jest.fn().mockResolvedValue(true),
            selectThread: jest.fn().mockResolvedValue(threadInfo),
            selectComments: jest.fn().mockResolvedValue(comments),
            selectReplies: jest.fn().mockResolvedValue(replies),
            logger: { info: () => {} },
        };

        const result = await getComments(mockService)(threadInfo.id);

        expect(result).toHaveProperty('title',threadInfo.title);
        expect(result).toHaveProperty('body', threadInfo.body);
        expect(result).toHaveProperty('username', threadInfo.username);

        expect(result.comments.length).toBe(2);
        expect(result.comments[0]).toHaveProperty('username', comments[0].username);
        expect(result.comments[0]).toHaveProperty('content', comments[0].content);
        expect(result.comments[0]).toHaveProperty('replies');

        expect(result.comments[0].replies.length).toBe(2);
        expect(result.comments[0].replies[0]).toHaveProperty('username', replies[0].username);
        expect(result.comments[0].replies[0]).toHaveProperty('content', replies[0].content);

        expect(mockService.isThreadExist).toHaveBeenCalledWith(threadInfo.id);
        expect(mockService.selectThread).toHaveBeenCalledWith(threadInfo.id);
        expect(mockService.selectComments).toHaveBeenCalledWith(threadInfo.id);
        expect(mockService.selectReplies).toHaveBeenCalledWith(threadInfo.id);
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

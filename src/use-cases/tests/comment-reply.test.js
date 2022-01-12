const commentReply = require('../comment-reply');

describe('comment reply', () => {
    it('should create a comment reply', async () => {
        const threadId = 'threadId';
        const commentId = 'commentId';
        const comment = {
            owner: 'ownerId',
            content: 'a reply',
            thread: threadId,
        };

        const mockService = {
            isThreadExist: jest.fn().mockResolvedValue(true),
            isCommentExist: jest.fn().mockResolvedValue(true),
            insertReply: jest.fn().mockReturnValue(comment),
            logger: { info: () => {} },
        };

        const result = await commentReply(mockService)(threadId, commentId, comment);

        expect(result).toEqual(comment);

        expect(mockService.isThreadExist).toHaveBeenCalledWith(threadId);
        expect(mockService.isCommentExist).toHaveBeenCalledWith(commentId);
        expect(mockService.insertReply).toHaveBeenCalledWith(commentId, comment);
    });

    it('should reject non exist thread', async () => {
        const mockService = {
            isThreadExist: () => Promise.resolve(false),
            logger: { info: () => {} },
        };

        await commentReply(mockService)(null, null, null).catch((e) => {
            expect(e).toHaveProperty('isDB');
        });
    });

    it('should reject non exist comment', async () => {
        const mockService = {
            isThreadExist: () => Promise.resolve(true),
            isCommentExist: () => Promise.resolve(false),
            logger: { info: () => {} },
        };

        await commentReply(mockService)(null, null, null).catch((e) => {
            expect(e).toHaveProperty('isDB');
        });
    });
});

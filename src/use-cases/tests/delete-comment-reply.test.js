const deleteCommentReply = require('../delete-comment-reply');

describe('delete comment reply', () => {
    it('should delete comment reply', async () => {
        const mockService = {
            isThreadExist: jest.fn().mockResolvedValue(true),
            isCommentExist: jest.fn().mockResolvedValue(true),
            isReplyExist: jest.fn().mockResolvedValue(true),
            isReplyOwner: jest.fn().mockResolvedValue(true),
            softDeleteReply: jest.fn().mockResolvedValue(true),
            logger: { info: () => {} },
        };

        const threadId = 'threadId';
        const commentId = 'commentId';
        const replyId = 'replyId';
        const userId = 'userId';

        const result = await deleteCommentReply(mockService)(
            threadId,
            commentId,
            replyId,
            userId
        );

        expect(mockService.isThreadExist).toHaveBeenCalledWith(threadId);
        expect(mockService.isCommentExist).toHaveBeenCalledWith(commentId);
        expect(mockService.isReplyExist).toHaveBeenCalledWith(replyId);
        expect(mockService.isReplyOwner).toHaveBeenCalledWith(replyId, userId);
        expect(mockService.softDeleteReply).toHaveBeenCalledWith(replyId);
    });

    it('should reject non existent thread', async () => {
        const mockService = {
            isThreadExist: () => Promise.resolve(false),
            logger: { info: () => {} },
        };

        await deleteCommentReply(mockService)(null, null, null, null).catch(
            (e) => {
                expect(e).toHaveProperty('isDB');
            }
        );
    });

    it('should reject non existent comment', async () => {
        const mockService = {
            isThreadExist: () => Promise.resolve(true),
            isCommentExist: () => Promise.resolve(false),
            logger: { info: () => {} },
        };

        await deleteCommentReply(mockService)(null, null, null, null).catch(
            (e) => {
                expect(e).toHaveProperty('isDB');
            }
        );
    });

    it('should reject non existent reply', async () => {
        const mockService = {
            isThreadExist: () => Promise.resolve(true),
            isCommentExist: (commentId) =>
                Promise.resolve(commentId === 'commentId'),
            isReplyExist: () => Promise.resolve(false),
            logger: { info: () => {} },
        };

        await deleteCommentReply(mockService)(
            null,
            'commentId',
            null,
            null
        ).catch((e) => {
            expect(e).toHaveProperty('isDB');
        });
    });

    it('should reject non owner reply', async () => {
        const mockService = {
            isThreadExist: () => Promise.resolve(true),
            isCommentExist: (commentId) =>
                Promise.resolve(
                    commentId === 'commentId' || commentId === 'replyId'
                ),
            isReplyExist: () => Promise.resolve(true),
            isReplyOwner: () => Promise.resolve(false),
            logger: { info: () => {} },
        };

        await deleteCommentReply(mockService)(
            null,
            'commentId',
            'replyId',
            null
        ).catch((e) => {
            expect(e).toHaveProperty('isDB');
        });
    });
});

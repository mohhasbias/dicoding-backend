const deleteCommentReply = require('./delete-comment-reply');

describe('delete comment reply', () => {
    it('should delete comment reply', async () => {
        const mockService = {
            isThreadExist: () => Promise.resolve(true),
            isCommentExist: () => Promise.resolve(true),
            isCommentOwner: () => Promise.resolve(true),
            softDeleteComment: () => Promise.resolve(true),
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
            isCommentOwner: () => Promise.resolve(false),
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

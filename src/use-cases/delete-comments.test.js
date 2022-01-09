const deleteComments = require('./delete-comments');

describe('delete comment', () => {
    it('should delete comment', async () => {
        const mockService = {
            isThreadExist: jest.fn().mockResolvedValue(true),
            isCommentExist: jest.fn().mockResolvedValue(true),
            isCommentOwner: jest.fn().mockResolvedValue(true),
            softDeleteComment: jest.fn().mockResolvedValue(true),
            logger: { info: () => {} },
        };

        const result = await deleteComments(mockService)();

        expect(result).toBeTruthy();

        expect(mockService.isThreadExist).toHaveBeenCalled();
        expect(mockService.isCommentExist).toHaveBeenCalled();
        expect(mockService.isCommentOwner).toHaveBeenCalled();
        expect(mockService.softDeleteComment).toHaveBeenCalled();
    });

    it('should reject non existent thread', async () => {
        const mockService = {
            isThreadExist: () => Promise.resolve(false),
            logger: { info: () => {} },
        };

        await deleteComments(mockService)().catch((e) => {
            expect(e).toHaveProperty('isDB');
        });

    });

    it('should reject non existent commnet', async () => {
        const mockService = {
            isThreadExist: () => Promise.resolve(true),
            isCommentExist: () => Promise.resolve(false),
            logger: { info: () => {} },
        };

        await deleteComments(mockService)().catch((e) => {
            expect(e).toHaveProperty('isDB');
        });
    });

    it('should reject non owner comment', async () => {
        const mockService = {
            isThreadExist: () => Promise.resolve(true),
            isCommentExist: () => Promise.resolve(true),
            isCommentOwner: () => Promise.resolve(false),
            logger: { info: () => {} },
        };

        await deleteComments(mockService)().catch((e) => {
            expect(e).toHaveProperty('isDB');
        });
    });
});

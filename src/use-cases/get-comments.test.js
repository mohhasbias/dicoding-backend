const getComments = require('./get-comments');

describe('get comments', () => {
    it('should get comments', async () => {
        const mockService = {
            isThreadExist: () => Promise.resolve(true),
            queryThreadComments: () => Promise.resolve(true),
            logger: { info: () => {} },
        };

        const result = await getComments(mockService)();

        expect(result).toBeTruthy();
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

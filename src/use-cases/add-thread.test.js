const addThread = require('./add-thread');

describe('add thread', () => {
    it('should add thread', async () => {
        const mockService = {
            insertThread: (thread) => Promise.resolve(thread),
            logger: {
                info: () => {},
            },
        };

        const owner = 'owner id';

        const thread = {
            title: 'a thread',
            body: 'a thread body',
        };

        const result = await addThread(mockService)(owner, thread);

        expect(result).toEqual({
            owner,
            ...thread,
        });
    });
});

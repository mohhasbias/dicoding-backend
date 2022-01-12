const addThread = require('../add-thread');

describe('add thread', () => {
    it('should add thread', async () => {
        const owner = 'owner id';

        const thread = {
            title: 'a thread',
            body: 'a thread body',
        };

        const mockService = {
            insertThread: jest.fn().mockResolvedValue({ ...thread, owner }),
            logger: {
                info: () => {},
            },
        };

        const result = await addThread(mockService)(owner, thread);

        expect(result).toEqual({
            ...thread,
            owner,
        });

        expect(mockService.insertThread).toHaveBeenCalledWith({
            ...thread,
            owner,
        });
    });
});

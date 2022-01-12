const newThread = require('../thread');

describe('threads', () => {
    it('should validate', () => {
        const badThreadPayloads = [
            {},
            { body: 'A Body' },
            { title: 123, body: 'A Body' },
            { title: 'A Thread' },
            { title: 'A Thread', body: true },
        ];

        badThreadPayloads.map((c) => {
            expect(() => newThread(c)).toThrow();
        });

        const validThreadPayload = {
            owner: 'owner-id',
            title: 'sebuah thread',
            body: 'sebuah body thread',
        };

        expect(() => newThread(validThreadPayload)).not.toThrow();
    });
});

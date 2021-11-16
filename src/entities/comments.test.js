const newComment = require('./comment');

describe('comments', () => {
    it('should validate', () => {
        const badAddCommentPayloads = [{}, { content: 123 }];

        badAddCommentPayloads.map((c) => {
            expect(() => newComment(c)).toThrow();
        });

        const validPayload = {
            owner: 'owner-id',
            content: 'sebuah comment',
            thread: 'thread-id',
        };

        expect(() => newComment(validPayload)).not.toThrow();
    });
});

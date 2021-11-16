const db = require('../../../infrastructures/db');
const logger = require('../../../infrastructures/logger');

const insertCommentReply = require('./insert-comment-reply');

describe('insert comment reply', () => {
    it('should insert comment reply', async () => {
        const comment = {
            content: 'sebuah comment',
        };

        const spyComments = jest.spyOn(db, 'comments');

        const result = await insertCommentReply({ db, logger })(null, comment);

        expect(spyComments).toHaveBeenCalled();
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('content');
        expect(result).toHaveProperty('owner');

        const violatingReply = {
            ...comment,
            owner: 'owner-id',
        };

        expect.assertions(6);
        await insertCommentReply({ db, logger })(null, violatingReply).catch((e) => {
            expect(e).toHaveProperty('isDB', true);
        });

        expect(spyComments).toHaveBeenCalled();
    });
});

const db = require('../../../infrastructures/db');
const logger = require('../../../infrastructures/logger');

const insertComment = require('./insert-comment');

describe('insert comment', () => {
    it('should insert comment', async () => {
        const comment = {
            content: 'sebuah comment',
        };

        const spyComments = jest.spyOn(db, 'comments');

        const result = await insertComment({ db, logger })(comment);

        expect(spyComments).toHaveBeenCalled();
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('content');
        expect(result).toHaveProperty('owner');

        const violatingComment = {
            ...comment,
            owner: 'owner-id',
        };

        expect.assertions(6);
        await insertComment({ db, logger })(violatingComment).catch((e) => {
            expect(e).toHaveProperty('isDB', true);
        });

        expect(spyComments).toHaveBeenCalled();
    });
});

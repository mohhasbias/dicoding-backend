const db = require('../../../infrastructures/db');
const logger = require('../../../infrastructures/logger');

const queryThreadComments = require('./query-thread-comments');

describe('query thread comment', () => {
    it('should query thread comment', async () => {
        const spyConn = jest.spyOn(db, 'conn');

        const result = await queryThreadComments({ db, logger })(null);

        expect(spyConn).toHaveBeenCalled();
        expect(result).toHaveProperty('comments');

        spyConn.mockImplementation(() => {
            throw new Error();
        });
        
        expect.assertions(3);
        await queryThreadComments({ db, logger })(null).catch((e) => {
            expect(e).toHaveProperty('isDB');
        });
    });
});

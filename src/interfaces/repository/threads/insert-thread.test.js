const db = require('../../../infrastructures/db');
const logger = require('../../../infrastructures/logger');

const insertThread = require('./insert-thread');

describe('insert thread', () => {
    it('should insert thread', async () => {
        const thread = {
            title: 'sebuah thread',
            body: 'sebuah body thread',
        };

        const spyThread = jest.spyOn(db, 'threads');

        const result = await insertThread({ db, logger })(thread);

        expect(spyThread).toHaveBeenCalled();
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('title');
        expect(result).toHaveProperty('owner');

        const violatingThread = {
            ...thread,
            owner: 'owner-id',
        };

        expect.assertions(6);
        await insertThread({ db, logger })(violatingThread).catch((e) => {
            expect(e).toHaveProperty('isDB', true);
        });

        expect(spyThread).toHaveBeenCalled();
    });
});

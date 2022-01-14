const { createDbConnection } = require('.src/infrastructures/db');
const logger = require('./src/infrastructures/logger');

const environment = 'development';
const config = require('./src/infrastructures/db/knexfile')[environment];

const db = createDbConnection(config, { logger });

const insertThread = require('../insert-thread');
const isThreadExist = require('../is-thread-exist');

describe('insert thread', () => {
    it('should insert thread', async () => {
        const thread = {
            title: 'sebuah thread',
            body: 'sebuah body thread',
        };
        const result = await insertThread({ db, logger })(thread);

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('title');
        expect(result).toHaveProperty('owner');

        const isExist = await isThreadExist({ db, logger })(result.id);

        expect(isExist).toBeTruthy();
    });

    it('should throw error on query error', async () => {
        const thread = {
            title: 'sebuah thread',
            body: 'sebuah body thread',
        };

        const violatingThread = {
            ...thread,
            owner: 'owner-id',
        };

        jest.spyOn(db, 'threads');

        db.threads.mockImplementation(() => {
            throw new Error('simulate query error');
        });

        await insertThread({ db, logger })(violatingThread).catch((e) => {
            expect(e).toHaveProperty('isDB', true);
        });

        db.threads.mockRestore(); 
    });
});

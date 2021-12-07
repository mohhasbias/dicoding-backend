const db = require('../../../infrastructures/db');
const logger = require('../../../infrastructures/logger');

const insertThread = require('./insert-thread');
const selectThread = require('./select-thread');

describe('select thread', () => {
    const services = {
        db,
        logger,
    };

    it('should return thread information', async () => {
        const thread = {
            title: 'a thread',
            body: 'a thread body',
        };
        
        const { id: threadId } = await insertThread(services)(thread);

        const threadInfo = await selectThread(services)(threadId);

        expect(threadInfo).toHaveProperty('id');
        expect(threadInfo).toHaveProperty('title');
        expect(threadInfo).toHaveProperty('body');
        expect(threadInfo).toHaveProperty('date');
        expect(threadInfo).toHaveProperty('username');
    });

    it('should throw an error on query error', async () => {
        jest.spyOn(db, 'conn');

        db.conn.mockImplementation(() => {
            throw new Error('simulate query error');
        });

        await selectThread(services)().catch((e) => {
            expect(e).toHaveProperty('isDB');
        });

        db.conn.mockRestore();
    });
});

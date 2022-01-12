const { createDbConnection } = require('.src/infrastructures/db');
const logger = require('./src/infrastructures/logger');

const environment = 'development';
const config = require('./src/knexfile')[environment];

const db = createDbConnection(config, { logger });

const insertUser = require('../../users/insert-user');
const insertThread = require('../insert-thread');
const selectThread = require('../select-thread');

describe('select thread', () => {
    const services = {
        db,
        logger,
    };

    afterAll(() => {
        db.conn().destroy();
    });

    it('should return thread information', async () => {
        const user = {
            username: 'username' + Date.now(),
            fullname: 'fullname' + Date.now(),
            password: 'password',
        };

        const { id: userId } = await insertUser(services)(user);

        const thread = {
            title: 'a thread',
            body: 'a thread body',
            owner: userId,
        };
        
        const { id: threadId } = await insertThread(services)(thread);

        const threadInfo = await selectThread(services)(threadId);

        expect(threadInfo).toHaveProperty('id', expect.anything());
        expect(threadInfo).toHaveProperty('title', thread.title);
        expect(threadInfo).toHaveProperty('body', thread.body);
        expect(threadInfo).toHaveProperty('date', expect.anything());
        expect(threadInfo).toHaveProperty('username', user.username);
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

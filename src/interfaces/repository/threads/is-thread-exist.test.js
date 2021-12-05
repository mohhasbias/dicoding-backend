const db = require('../../../infrastructures/db');
const logger = require('../../../infrastructures/logger');

const insertUser = require('../users/insert-user');
const insertThread = require('./insert-thread');
const isThreadExist = require('./is-thread-exist');

describe('is thread exist', () => {
    const services = {
        db,
        logger,
    };

    it('should check if thread exist', async () => {
        const user = {
            username: 'username' + Date.now(),
            fullname: 'fullname' + Date.now(),
            password: 'password',
        };

        const addedUser = await insertUser(services)(user);

        expect(addedUser.username).toEqual(user.username);
        expect(addedUser).toHaveProperty('id');

        const newThread = {
            title: 'New Thread',
            owner: addedUser.id,
        };

        const thread = await insertThread(services)(newThread);

        expect(thread).toHaveProperty('title', newThread.title);
        expect(thread).toHaveProperty('owner', newThread.owner);

        const result = await isThreadExist(services)(thread.id);

        expect(result).toBeTruthy();
    });

    it('should throw error on query error', async () => {
        jest.spyOn(db, 'threads');

        db.threads.mockImplementation(() => {
            throw new Error('simulate query error');
        });

        await isThreadExist(services)('threadId').catch((e) => {
            expect(e).toHaveProperty('isDB');
        });

        db.threads.mockRestore();
    });
});

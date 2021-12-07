const db = require('../../../infrastructures/db');
const logger = require('../../../infrastructures/logger');

const insertUser = require('../users/insert-user');
const insertThread = require('../threads/insert-thread');
const insertComment = require('./insert-comment');
const selectComment = require('./select-comment');

describe('select comment', () => {
    const services = {
        db,
        logger,
    };

    it('should select comment for a thread', async () => {
        const user = {
            username: 'username' + Date.now(),
            fullname: 'fullname' + Date.now(),
            password: 'password',
        };

        const { id: userId } = await insertUser(services)(user);

        const { id: threadId } = await insertThread(services)({
            title: 'a thread',
            body: 'a thread body',
            owner: userId,
        });

        let comments;
        comments = await selectComment(services)(threadId);

        expect(comments.length).toBe(0);

        await insertComment(services)({
            thread: threadId,
            content: 'sebuah balasan',
            owner: userId,
        });

        comments = await selectComment(services)(threadId);

        expect(comments.length).toBe(1);

        expect(comments[0]).toHaveProperty('id');
        expect(comments[0]).toHaveProperty('username');
        expect(comments[0]).toHaveProperty('date');
        expect(comments[0]).toHaveProperty('content');
        expect(comments[0]).toHaveProperty('replyTo');
    });

    it('should throw an error on query error', async () => {
        jest.spyOn(db, 'conn');

        db.conn.mockImplementation(() => {
            throw new Error('simulate query error');
        });

        await selectComment(services)('threadId').catch((e) => {
            expect(e).toHaveProperty('isDB');
        });

        db.conn.mockRestore();
    });
});

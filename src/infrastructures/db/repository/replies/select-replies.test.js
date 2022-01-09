const { createDbConnection } = require('.src/infrastructures/db');
const logger = require('./src/infrastructures/logger');

const environment = 'development';
const config = require('./src/knexfile')[environment];

const db = createDbConnection(config, { logger });

const insertUser = require('../users/insert-user');
const insertThread = require('../threads/insert-thread');
const insertComment = require('../comments/insert-comment');
const selectComments = require('../comments/select-comments');
const insertReply = require('./insert-reply');
const selectReplies = require('./select-replies');

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
        comments = await selectComments(services)(threadId);

        expect(comments.length).toBeDefined();

        const numBeforeInsert = comments.length;

        const { id: commentId } = await insertComment(services)({
            thread: threadId,
            content: 'sebuah comment',
            owner: userId,
        });

        comments = await selectComments(services)(threadId);

        expect(comments.length).toBe(numBeforeInsert + 1);

        expect(comments[0]).toHaveProperty('id', expect.anything());
        expect(comments[0]).toHaveProperty('username', user.username);
        expect(comments[0]).toHaveProperty('date', expect.anything());
        expect(comments[0]).toHaveProperty('content', 'sebuah comment');

        const reply = {
            thread: threadId,
            content: 'sebuah balasan',
            owner: userId,
        };

        await insertReply(services)(commentId, reply);

        const replies = await selectReplies(services)(threadId);

        expect(replies.length).toBeGreaterThan(0);
    });

    it('should throw an error on query error', async () => {
        jest.spyOn(db, 'conn');

        db.conn.mockImplementation(() => {
            throw new Error('simulate query error');
        });

        await selectReplies(services)('threadId').catch((e) => {
            expect(e).toHaveProperty('isDB');
        });

        db.conn.mockRestore();
    });
});

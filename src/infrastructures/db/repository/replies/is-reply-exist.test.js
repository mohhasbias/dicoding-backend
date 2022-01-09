const { createDbConnection } = require('.src/infrastructures/db');
const logger = require('./src/infrastructures/logger');

const environment = 'development';
const config = require('./src/knexfile')[environment];

const db = createDbConnection(config, { logger });

const insertUser = require('../users/insert-user');
const insertThread = require('../threads/insert-thread');
const insertComment = require('../comments/insert-comment');
const insertReply = require('./insert-reply');
const isReplyExist = require('./is-reply-exist');

describe('is reply exist', () => {
    const services = {
        db,
        logger,
    };

    it('should check if reply exist', async () => {
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

        const comment = {
            thread: threadId,
            content: 'sebuah comment',
            owner: userId,
        };

        const { id: commentId } = await insertComment(services)(comment);

        const reply = {
            thread: threadId,
            content: 'sebuah balasan',
            owner: userId,
        };

        const { id: replyId } = await insertReply(services)(commentId, reply);

        const result = await isReplyExist(services)(replyId);

        expect(result).toBeTruthy();
    });

    it('should throw error on query error', async () => {
        jest.spyOn(db, 'replies');

        db.replies.mockImplementation(() => {
            throw new Error('simulate query error');
        });

        await isReplyExist(services)('comment-id').catch((e) => {
            expect(e).toHaveProperty('isDB');
        });
    });
});

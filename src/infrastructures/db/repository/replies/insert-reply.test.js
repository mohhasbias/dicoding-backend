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

describe('insert reply', () => {
    const services = {
        db,
        logger,
    };

    it('should insert reply', async () => {
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
        }

        const addedReply = await insertReply(services)(commentId, reply);

        expect(addedReply).toHaveProperty('id');
        expect(addedReply).toHaveProperty('content', reply.content);
        expect(addedReply).toHaveProperty('owner', reply.owner);

        const isExist = await isReplyExist(services)(addedReply.id);

        expect(isExist).toBeTruthy();
    });

    it('should throw error on invalid comment', async () => {
        const violatingReply = {
            content: 'sebuah balasan',
            owner: 'owner-id',
        };

        jest.spyOn(db, 'replies');

        db.replies.mockImplementation(() => {
            throw new Error('simulate query error');
        });

        await insertReply({ db, logger })(violatingReply).catch((e) => {
            expect(e).toHaveProperty('isDB', true);
        });

        db.replies.mockRestore();
    });
});

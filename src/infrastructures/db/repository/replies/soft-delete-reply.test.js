const { createDbConnection } = require('.src/infrastructures/db');
const logger = require('./src/infrastructures/logger');

const environment = 'development';
const config = require('./src/knexfile')[environment];

const db = createDbConnection(config, { logger });

const insertUser = require('../users/insert-user');
const insertThread = require('../threads/insert-thread');
const insertComment = require('../comments/insert-comment');
const insertReply = require('./insert-reply');
const softDeleteReply = require('./soft-delete-reply');
const selectReplies = require('./select-replies');

describe('soft delete reply', () => {
    const services = {
        db,
        logger,
    };

    it('should soft delete reply', async () => {
        const user = {
            username: 'test' + Date.now(),
            fullname: 'test' + Date.now(),
            password: 'password',
        };

        const { id: userId } = await insertUser(services)(user);

        const { id: threadId } = await insertThread(services)({
            title: 'thread title',
            body: 'thread body',
            owner: userId,
        });

        const comment = {
            owner: userId,
            content: 'sebuah komen',
            thread: threadId,
        };

        const { id: commentId } = await insertComment(services)(comment);

        const reply = {
            owner: userId,
            content: 'sebuah balasan',
            comment: commentId,
            thread: threadId,
        };

        const { id: replyId } = await insertReply(services)(commentId, reply);

        const result = await softDeleteReply(services)(replyId);

        expect(result.isDelete).toBeTruthy();

        const listReply = await selectReplies(services)(threadId);

        const deletedReply = listReply.find((r) => r.id === replyId);

        expect(deletedReply).toHaveProperty('id', replyId);
        expect(deletedReply).toHaveProperty('username', user.username);
        expect(deletedReply).toHaveProperty('content', '**balasan telah dihapus**');
    });

    it('should throw an error on query error', async () => {
        jest.spyOn(db, 'comments');

        db.comments.mockImplementation(() => {
            throw new Error('simulate query error');
        });

        await softDeleteReply(services)().catch((e) => {
            expect(e).toHaveProperty('isDB');
        });
    });
});

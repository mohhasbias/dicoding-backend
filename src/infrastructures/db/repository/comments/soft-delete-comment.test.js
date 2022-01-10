const { createDbConnection } = require('.src/infrastructures/db');
const logger = require('./src/infrastructures/logger');

const environment = 'development';
const config = require('./src/knexfile')[environment];

const db = createDbConnection(config, { logger });

const insertUser = require('../users/insert-user');
const insertThread = require('../threads/insert-thread');
const insertComment = require('./insert-comment');
const softDeleteComment = require('./soft-delete-comment');
const selectComments = require('./select-comments');

describe('soft delete comment', () => {
    const services = {
        db,
        logger,
    };

    it('should soft delete comment', async () => {
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

        const result = await softDeleteComment(services)(
            commentId,
        );

        expect(result.isDelete).toBeTruthy();

        const listComment = await selectComments(services)(threadId);

        const deletedComment = listComment.find((c) => c.id === commentId);

        expect(deletedComment).toHaveProperty('id', commentId);
        expect(deletedComment).toHaveProperty('username', user.username);
        expect(deletedComment).toHaveProperty('isDelete', true);
    });

    it('should throw an error on query error', async () => {
        jest.spyOn(db, 'comments');

        db.comments.mockImplementation(() => {
            throw new Error('simulate query error');
        });

        await softDeleteComment(services)().catch((e) => {
            expect(e).toHaveProperty('isDB');
        });
    });
});

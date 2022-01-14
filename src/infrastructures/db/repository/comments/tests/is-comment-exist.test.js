const { createDbConnection } = require('.src/infrastructures/db');
const logger = require('./src/infrastructures/logger');

const environment = 'development';
const config = require('./src/infrastructures/db/knexfile')[environment];

const db = createDbConnection(config, { logger });

const insertUser = require('../../users/insert-user');
const insertThread = require('../../threads/insert-thread');
const insertComment = require('../insert-comment');
const isCommentExist = require('../is-comment-exist');

describe('is comment exist', () => {
    const services = {
        db,
        logger,
    };

    it('should check if comment exist', async () => {
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

        const result = await isCommentExist(services)(commentId);

        expect(result).toBeTruthy();
    });

    it('should throw error on query error', async () => {
        jest.spyOn(db, 'comments');

        db.comments.mockImplementation(() => {
            throw new Error('simulate query error');
        });

        await isCommentExist(services)('comment-id').catch((e) => {
            expect(e).toHaveProperty('isDB');
        });
    });
});

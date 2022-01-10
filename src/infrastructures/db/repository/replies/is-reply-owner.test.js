const { createDbConnection } = require('.src/infrastructures/db');
const logger = require('./src/infrastructures/logger');

const environment = 'development';
const config = require('./src/knexfile')[environment];

const db = createDbConnection(config, { logger });

const insertUser = require('../users/insert-user');
const insertThread = require('../threads/insert-thread');
const insertComment = require('../comments/insert-comment');
const isCommentOwner = require('../comments/is-comment-owner');
const insertReply = require('./insert-reply');
const isReplyOwner = require('./is-reply-owner');

describe('is reply owner', () => {
    const services = {
        db,
        logger,
    };

    it('should return true if it is reply owner', async () => {
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

        const { id: commentId } = await insertComment(services)({
            owner: userId,
            content: 'a comment content',
            thread: threadId,
        });

        const result = await isCommentOwner(services)(commentId, userId);

        expect(result).toBeTruthy();

        const reply = {
            thread: threadId,
            content: 'sebuah balasan',
            owner: userId,
        }

        const addedReply = await insertReply(services)(commentId, reply);

        const isReplyOwnerResult = await isReplyOwner(services)(addedReply.id, userId);

        expect(isReplyOwnerResult).toBeTruthy();
    });

    it('should return false if it is not reply owner', async () => {
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

        const { id: commentId } = await insertComment(services)({
            owner: userId,
            content: 'a comment content',
            thread: threadId,
        });

        const result = await isCommentOwner(services)(
            commentId,
            'wrong-user-id'
        );

        expect(result).toBeFalsy();
    });

    it('should throw an error on query error', async () => {
        jest.spyOn(db, 'replies');

        db.replies.mockImplementation(() => {
            throw new Error('simulate query error');
        });

        await isReplyOwner(services)().catch((e) => {
            expect(e).toHaveProperty('isDB');
        });

        db.replies.mockRestore();
    });
});

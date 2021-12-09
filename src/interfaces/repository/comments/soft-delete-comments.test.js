const db = require('../../../infrastructures/db');
const logger = require('../../../infrastructures/logger');

const { extractComment } = require('./_utils');

const insertUser = require('../users/insert-user');
const insertThread = require('../threads/insert-thread');
const insertComment = require('./insert-comment');
const softDeleteComment = require('./soft-delete-comment');
const selectComment = require('./select-comment');

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

        const deleteContent = '**komentar telah dihapus**';

        const result = await softDeleteComment(services)(
            commentId,
            deleteContent
        );

        expect(result.isDelete).toBeTruthy();
        expect(result.deleteContent).toEqual(deleteContent);

        const listComment = await selectComment(services)(threadId);

        const deletedComment = extractComment(listComment.find((c) => c.id === commentId));

        expect(deletedComment).toHaveProperty('id', commentId);
        expect(deletedComment).toHaveProperty('username', user.username);
        expect(deletedComment).toHaveProperty('content', deleteContent);
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

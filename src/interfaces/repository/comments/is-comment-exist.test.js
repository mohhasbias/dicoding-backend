const db = require('../../../infrastructures/db');
const logger = require('../../../infrastructures/logger');

const insertComment = require('./insert-comment');
const isCommentExist = require('./is-comment-exist');

describe('is comment exist', () => {
    const services = {
        db,
        logger,
    };

    it('should check if comment exist', async () => {
        const comment = {};

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

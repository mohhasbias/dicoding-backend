const db = require('../../../infrastructures/db');
const logger = require('../../../infrastructures/logger');

const insertComment = require('./insert-comment');
const softDeleteComment = require('./soft-delete-comment');

describe('soft delete comment', () => {
    const services = {
        db,
        logger,
    };

    it('should soft delete comment', async () => {
        const { id: commentId } = await insertComment(services)({});

        const deleteContent = '**komentar telah dihapus**';

        const result = await softDeleteComment(services)(
            commentId,
            deleteContent
        );

        expect(result.content).toEqual(deleteContent);
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

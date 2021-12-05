const db = require('../../../infrastructures/db');
const logger = require('../../../infrastructures/logger');

const insertUser = require('../users/insert-user');
const insertComment = require('./insert-comment');
const isCommentOwner = require('./is-comment-owner');

describe('is comment owner', () => {
    const services = {
        db,
        logger,
    };

    it('should return true if it is comment owner', async () => {
        const user = {
            username: 'username' + Date.now(),
            fullname: 'fullname' + Date.now(),
            password: 'password',
        };

        const { id: userId } = await insertUser(services)(user);

        const { id: commentId } = await insertComment(services)({
            owner: userId,
        });

        const result = await isCommentOwner(services)(commentId, userId);

        expect(result).toBeTruthy();
    });

    it('should return false if it is not comment owner', async () => {
        const user = {
            username: 'username' + Date.now(),
            fullname: 'fullname' + Date.now(),
            password: 'password',
        };

        const { id: userId } = await insertUser(services)(user);

        const { id: commentId } = await insertComment(services)({
            owner: userId,
        });

        const result = await isCommentOwner(services)(
            commentId,
            'wrong-user-id'
        );

        expect(result).toBeFalsy();
    });

    it('should throw an error on query error', async () => {
        jest.spyOn(db, 'comments');

        db.comments.mockImplementation(() => {
            throw new Error('simulate query error');
        });

        await isCommentOwner(services)().catch((e) => {
            expect(e).toHaveProperty('isDB');
        });

        db.comments.mockRestore();
    });
});

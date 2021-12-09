const db = require('../../../infrastructures/db');
const logger = require('../../../infrastructures/logger');

const insertUser = require('../users/insert-user');
const insertThread = require('../threads/insert-thread');
const insertComment = require('./insert-comment');
const insertCommentReply = require('./insert-comment-reply');

describe('insert comment reply', () => {
    const services = {
        db,
        logger,
    };

    it('should insert comment reply', async () => {
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

        const spyComments = jest.spyOn(db, 'comments');

        const { id: commentId } = await insertComment(services)(comment);

        const reply = {
            thread: threadId,
            content: 'sebuah balasan',
            owner: userId,
        };

        const result = await insertCommentReply(services)(commentId, reply);

        expect(spyComments).toHaveBeenCalled();
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('content');
        expect(result).toHaveProperty('owner');

        spyComments.mockRestore();
    });

    it('should throw an error when invalid', async () => {
        const spyComments = jest.spyOn(db, 'comments');

        const violatingReply = {
            content: 'sebuah comment',
            owner: 'owner-id',
        };

        expect.assertions(2);
        await insertCommentReply({ db, logger })(null, violatingReply).catch((e) => {
            expect(e).toHaveProperty('isDB', true);
        });

        expect(spyComments).toHaveBeenCalled();

        spyComments.mockRestore();
    });
});

const db = require('../../../infrastructures/db');
const logger = require('../../../infrastructures/logger');

const insertUser = require('../users/insert-user');
const insertThread = require('../threads/insert-thread');
const insertComment = require('./insert-comment');
const isCommentExist = require('./is-comment-exist');

describe('insert comment', () => {
    const services = {
        db,
        logger,
    };

    it('should insert comment', async () => {
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

        const addedComment = await insertComment(services)(comment);

        expect(spyComments).toHaveBeenCalled();
        expect(addedComment).toHaveProperty('id');
        expect(addedComment).toHaveProperty('content', comment.content);
        expect(addedComment).toHaveProperty('owner', comment.owner);

        const isExist = await isCommentExist(services)(addedComment.id);

        expect(isExist).toBeTruthy();

        spyComments.mockRestore();
    });

    it('should throw error on invalid comment', async () => {
        const violatingComment = {
            content: 'sebuah comment',
            owner: 'owner-id',
        };

        const spyComments = jest.spyOn(db, 'comments');

        expect.assertions(2);
        await insertComment({ db, logger })(violatingComment).catch((e) => {
            expect(e).toHaveProperty('isDB', true);
        });

        expect(spyComments).toHaveBeenCalled();

        spyComments.mockRestore();
    });
});

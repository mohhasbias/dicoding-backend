const db = require('../../../infrastructures/db');
const logger = require('../../../infrastructures/logger');

const insertUser = require('../users/insert-user');
const insertThread = require('../threads/insert-thread');
const insertComment = require('../comments/insert-comment');
const insertReply = require('../comments/insert-comment-reply');
const queryThreadComments = require('./query-thread-comments');

describe('query thread comment', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it('should query thread comment', async () => {
        const spyConn = jest.spyOn(db, 'conn');

        const result = await queryThreadComments({ db, logger })(null);

        expect(spyConn).toHaveBeenCalled();
        expect(result).toHaveProperty('comments');

        spyConn.mockImplementation(() => {
            throw new Error();
        });

        expect.assertions(3);
        await queryThreadComments({ db, logger })(null).catch((e) => {
            expect(e).toHaveProperty('isDB');
        });
    });

    it('should return comments with replies', async () => {
        const user = {
            username: 'dicoding',
            password: 'secret',
            fullname: 'Dicoding Indonesia',
        };

        const { id: userId } = await insertUser({ db, logger })(user);

        const thread = {
            title: 'sebuah thread',
            body: 'sebuah body thread',
            owner: userId,
        };

        const { id: threadId } = await insertThread({ db, logger })(thread);

        const comment = {
            content: 'sebuah comment',
            thread: threadId,
            owner: userId,
        };

        const { id: commentId } = await insertComment({ db, logger })(comment);

        const reply = {
            content: 'sebuah balasan',
            thread: threadId,
            owner: userId,
        };

        const result = await insertReply({ db, logger })(commentId, reply);

        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('content');
        expect(result).toHaveProperty('owner');

        const threadComments = await queryThreadComments({ db, logger })(
            threadId
        );

        console.log(threadComments);
    });
});

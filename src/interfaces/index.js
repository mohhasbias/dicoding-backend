const postUser = require('./post-user');
const postAuthentications = require('./post-authentications');
const putAuthentications = require('./put-authentications');
const deleteAuthentications = require('./delete-authentications');
const postThreads = require('./post-thread');
const postThreadComment = require('./post-thread-comment');

const insertUser = require('./insert-user');
const isUserExist = require('./is-user-exist');
const verifyUser = require('./verify-user');
const addRefreshToken = require('./add-refresh-token');
const isTokenExist = require('./is-token-exist');
const removeRefreshToken = require('./remove-refresh-token');
const insertThread = require('./insert-thread');
const insertComment = require('./insert-comment');
const isThreadExist = require('./is-thread-exist');

// const getComments = require('./get-comments');

module.exports = (services) => {
    const dbHandler = {
        insertUser: insertUser(services),
        isUserExist: isUserExist(services),
        verifyUser: verifyUser(services),
        addRefreshToken: addRefreshToken(services),
        isTokenExist: isTokenExist(services),
        removeRefreshToken: removeRefreshToken(services),
        insertThread: insertThread(services),
        insertComment: insertComment(services),
        isThreadExist: isThreadExist(services),
    };

    const injectedServices = {
        ...services,
        db: dbHandler,
    };

    return [
        { method: 'POST', path: '/users', handler: postUser(injectedServices) },
        {
            method: 'POST',
            path: '/authentications',
            handler: postAuthentications(injectedServices),
        },
        {
            method: 'PUT',
            path: '/authentications',
            handler: putAuthentications(injectedServices),
        },
        {
            method: 'DELETE',
            path: '/authentications',
            handler: deleteAuthentications(injectedServices),
        },
        {
            method: 'POST',
            path: '/threads',
            handler: postThreads(injectedServices),
            options: {
                auth: 'forum_api_jwt',
            },
        },
        {
            method: 'POST',
            path: '/threads/{threadId}/comments',
            handler: postThreadComment(injectedServices),
            options: {
                auth: 'forum_api_jwt',
            },
        },
        // getComments
    ];
};

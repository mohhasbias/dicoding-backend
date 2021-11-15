const postUser = require('./handler/post-user');
const postAuthentications = require('./handler/post-authentications');
const putAuthentications = require('./handler/put-authentications');
const deleteAuthentications = require('./handler/delete-authentications');
const postThreads = require('./handler/post-thread');
const postThreadComment = require('./handler/post-thread-comment');

const insertUser = require('./repository/users/insert-user');
const isUserExist = require('./repository/users/is-user-exist');
const verifyUser = require('./repository/users/verify-user');
const addRefreshToken = require('./repository/authentications/add-refresh-token');
const isTokenExist = require('./repository/authentications/is-token-exist');
const removeRefreshToken = require('./repository/authentications/remove-refresh-token');
const insertThread = require('./repository/threads/insert-thread');
const insertComment = require('./repository/comments/insert-comment');
const isThreadExist = require('./repository/threads/is-thread-exist');

const getComments = require('./handler/get-comments');
const deleteComments = require('./handler/delete-comments');

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
        db: {
            ...dbHandler,
        },
    };

    return [
        {
            method: 'POST',
            path: '/users',
            handler: postUser(services),
        },
        {
            method: 'POST',
            path: '/authentications',
            handler: postAuthentications(services),
        },
        {
            method: 'PUT',
            path: '/authentications',
            handler: putAuthentications(services),
        },
        {
            method: 'DELETE',
            path: '/authentications',
            handler: deleteAuthentications(services),
        },
        {
            method: 'POST',
            path: '/threads',
            handler: postThreads(services),
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
        {
            method: 'GET',
            path: '/threads/{threadId}',
            handler: getComments(services),
        },
        {
            method: 'DELETE',
            path: '/threads/{threadId}/comments/{commentId}',
            handler: deleteComments(services),
            options: {
                auth: 'forum_api_jwt',
            },
        },
    ];
};

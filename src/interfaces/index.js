const postUser = require('./handler/post-user');
const postAuthentications = require('./handler/post-authentications');
const putAuthentications = require('./handler/put-authentications');
const deleteAuthentications = require('./handler/delete-authentications');
const postThreads = require('./handler/post-thread');
const postThreadComment = require('./handler/post-thread-comment');
const getComments = require('./handler/get-comments');
const deleteComments = require('./handler/delete-comments');

module.exports = (services) => {
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
            handler: postThreadComment(services),
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

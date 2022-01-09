const Joi = require('joi');

const { schema: userSchema } = require('../../entities/user');
const { schema: threadSchema } = require('../../entities/thread');

const postUser = require('./post-user');
const postAuthentications = require('./post-authentications');
const putAuthentications = require('./put-authentications');
const deleteAuthentications = require('./delete-authentications');
const postThreads = require('./post-thread');
const postThreadComment = require('./post-thread-comment');
const getComments = require('./get-comments');
const deleteComments = require('./delete-comments');
const postCommentReply = require('./post-comment-reply');
const deleteCommentReply = require('./delete-comment-reply');

const routesAndHandlers = [
    {
        method: 'POST',
        path: '/users',
        handler: postUser,
        options: {
            tags: ['api'],
        },
    },
    {
        method: 'POST',
        path: '/authentications',
        handler: postAuthentications,
        options: {
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    username: userSchema.extract('username'),
                    password: userSchema.extract('password'),
                }).label('Login'),
            },
        },
    },
    {
        method: 'PUT',
        path: '/authentications',
        handler: putAuthentications,
        options: {
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    refreshToken: Joi.string().required(),
                }).label('Refresh Token'),
            },
        },
    },
    {
        method: 'DELETE',
        path: '/authentications',
        handler: deleteAuthentications,
        options: {
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    refreshToken: Joi.string().required(),
                }).label('Refresh Token'),
            },
        },
    },
    {
        method: 'POST',
        path: '/threads',
        handler: postThreads,
        options: {
            auth: 'forum_api_jwt',
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    title: threadSchema.extract('title'),
                    body: threadSchema.extract('body'),
                }).label('Thread'),
            },
        },
    },
    {
        method: 'POST',
        path: '/threads/{threadId}/comments',
        handler: postThreadComment,
        options: {
            auth: 'forum_api_jwt',
            tags: ['api'],
            validate: {
                params: Joi.object({
                    threadId: Joi.string().required(),
                }).label('Thread ID'),
            },
        },
    },
    {
        method: 'GET',
        path: '/threads/{threadId}',
        handler: getComments,
        options: {
            tags: ['api'],
            validate: {
                params: Joi.object({
                    threadId: Joi.string().required(),
                }).label('Thread ID'),
            },
        },
    },
    {
        method: 'DELETE',
        path: '/threads/{threadId}/comments/{commentId}',
        handler: deleteComments,
        options: {
            auth: 'forum_api_jwt',
            tags: ['api'],
        },
    },
    {
        method: 'POST',
        path: '/threads/{threadId}/comments/{commentId}/replies',
        handler: postCommentReply,
        options: {
            auth: 'forum_api_jwt',
            tags: ['api'],
        },
    },
    {
        method: 'DELETE',
        path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
        handler: deleteCommentReply,
        options: {
            auth: 'forum_api_jwt',
            tags: ['api'],
        },
    },
    {
        method: 'GET',
        path: '/healthcheck',
        handler: ({ dbConn }) => async () => ({
            status: await dbConn.conn.raw('SELECT 1') ? 'up' : 'down',
        }),
        options: {
            tags: ['api'],
        },
    },
];

module.exports = routesAndHandlers;

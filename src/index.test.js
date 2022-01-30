require('dotenv').config();

// infrastructures
const createServer = require('./infrastructures/server');

const dependencyInjection = require('./container4http');

const addUserAndGetToken = async (server, user) => {
    await server.inject({
        method: 'POST',
        url: '/users',
        payload: user,
    });

    const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
            username: user.username,
            password: user.password,
        },
    });

    accessToken = response.result.data.accessToken;

    return accessToken;
};

describe('Hapi server test untuk resource thread dan comment', () => {
    const httpConfig = {
        host: process.env.HOST,
        port: process.env.PORT,
    };

    let server = null;

    const user = {
        username: `test_user_${Date.now()}`,
        fullname: 'test user fullname',
        password: 'test_password',
    };

    const johnDoe = {
        username: `john_doe_${Date.now()}`,
        fullname: 'john doe',
        password: 'john_doe_password',
    };

    const dicoding = {
        username: `dicoding_${Date.now()}`,
        fullname: 'dicoding',
        password: 'dicoding_password',
    };

    let accessToken = null;
    let accessToken4JohnDoe = null;
    let accessToken4Dicoding = null;

    beforeAll(async () => {
        server = await createServer(httpConfig, dependencyInjection.routes, {
            logger: dependencyInjection.logger,
        });
        await server.initialize();

        accessToken = await addUserAndGetToken(server, user);

        accessToken4JohnDoe = await addUserAndGetToken(server, johnDoe);

        accessToken4Dicoding = await addUserAndGetToken(server, dicoding);
    });

    describe('Resource /threads', () => {
        describe('Add Thread with No Authentication', () => {
            let response = null;

            beforeAll(async () => {
                response = await server.inject({
                    method: 'POST',
                    url: '/threads',
                });
            });

            it('should response 401 status code', async () => {
                expect(response.statusCode).toEqual(401);
            });

            it('should show Missing Authentication message', async () => {
                const responseJson = response.result;
                expect(responseJson).toBeInstanceOf(Object);
                expect(responseJson.message).toEqual('Missing authentication');
            });
        });

        const badThreadPayloads = [
            {},
            { body: 'A Body' },
            { title: 123, body: 'A Body' },
            { title: 'A Thread' },
            { title: 'A Thread', body: true },
        ];

        describe.each(badThreadPayloads)(
            'Add Thread with Bad Payload',
            (badPayload) => {
                let response = null;

                beforeAll(async () => {
                    response = await server.inject({
                        method: 'POST',
                        url: '/threads',
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        payload: badPayload,
                    });
                });

                it('should response 400 status code', async () => {
                    expect(response).toHaveProperty('statusCode', 400);
                });

                it('should show fail status and message', async () => {
                    const responseJson = response.result;

                    expect(responseJson).toBeInstanceOf(Object);
                    expect(responseJson.status).toEqual('fail');
                    expect(typeof responseJson.message).toBe('string');
                    expect(responseJson.message).not.toEqual('');
                });
            }
        );

        describe('Add Thread with Valid Payload', () => {
            let response = null;

            beforeAll(async () => {
                response = await server.inject({
                    method: 'POST',
                    url: '/threads',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    payload: {
                        title: 'A Thread',
                        body: 'A Body',
                    },
                });
            });

            it('should response 201 status code', async () => {
                expect(response).toHaveProperty('statusCode', 201);
            });

            it('should reponse with valid property and value', () => {
                const responseJson = response.result;

                expect(responseJson).toBeInstanceOf(Object);
                expect(responseJson.status).toEqual('success');
                expect(responseJson.data).toBeInstanceOf(Object);
                expect(responseJson.data.addedThread).toBeInstanceOf(Object);
                expect(typeof responseJson.data.addedThread.id).toBe('string');
                expect(responseJson.data.addedThread.id).not.toEqual('');
                expect(typeof responseJson.data.addedThread.title).toBe(
                    'string'
                );
                expect(responseJson.data.addedThread.title).not.toEqual('');
                expect(typeof responseJson.data.addedThread.owner).toBe(
                    'string'
                );
                expect(responseJson.data.addedThread.owner).not.toEqual('');
            });
        });
    });

    describe('Resource /comments', () => {
        let threadId = null;
        const thread = {
            title: 'A Thread',
            body: 'A Body',
        };

        beforeAll(async () => {
            const res = await server.inject({
                method: 'POST',
                url: '/threads',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                payload: thread,
            });

            threadId = res.result.data.addedThread.id;

            expect(typeof threadId).toBe('string');
            expect(threadId).not.toEqual('');
        });

        describe('Add Comment with No Authentication', () => {
            let response = null;

            beforeAll(async () => {
                response = await server.inject({
                    method: 'POST',
                    url: `/threads/${threadId}/comments`,
                });
            });

            it('should response 401 status code', async () => {
                expect(response.statusCode).toEqual(401);
            });

            it('should show Missing Authentication message', async () => {
                const responseJson = response.result;
                expect(responseJson).toBeInstanceOf(Object);
                expect(responseJson.message).toEqual('Missing authentication');
            });
        });

        describe('Add Comment with Not Found Thread', () => {
            let response = null;

            beforeAll(async () => {
                response = await server.inject({
                    method: 'POST',
                    url: '/threads/123/comments',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    payload: {
                        content: 'A Comment',
                    },
                });
            });

            it('response should have 404 status code', async () => {
                expect(response.statusCode).toEqual(404);
            });

            it('response should have correct property and value', async () => {
                const responseJson = response.result;
                expect(responseJson).toBeInstanceOf(Object);
                expect(responseJson.status).toEqual('fail');
                expect(responseJson.message).not.toEqual('');
            });
        });

        const badAddCommentPayloads = [
            {},
            { content: 123 },
            { invalidField: 'A Value' },
        ];

        describe.each(badAddCommentPayloads)(
            'Add Comment with Invalid Payload',
            (badPayload) => {
                let response = null;

                beforeAll(async () => {
                    response = await server.inject({
                        method: 'POST',
                        url: `/threads/${threadId}/comments`,
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        payload: badPayload,
                    });
                });

                it('response should have 400 status code', async () => {
                    expect(response.statusCode).toEqual(400);
                });

                it('response should have correct property and value', async () => {
                    const responseJson = response.result;
                    expect(responseJson).toBeInstanceOf(Object);
                    expect(responseJson.status).toEqual('fail');
                    expect(responseJson.message).not.toEqual('');
                });
            }
        );

        const newComment = {
            content: 'A Comment',
        };

        describe('Add Comment with User Johndoe', () => {
            let response = null;

            beforeAll(async () => {
                response = await server.inject({
                    method: 'POST',
                    url: `/threads/${threadId}/comments`,
                    headers: {
                        Authorization: `Bearer ${accessToken4JohnDoe}`,
                    },
                    payload: newComment,
                });
            });

            it('response should have 201 status code', async () => {
                expect(response.statusCode).toEqual(201);
            });

            it('response should have correct property and value', async () => {
                const responseJson = response.result;
                expect(responseJson).toBeInstanceOf(Object);
                expect(responseJson.status).toEqual('success');
                expect(responseJson.data).toBeInstanceOf(Object);
                expect(responseJson.data.addedComment).toBeInstanceOf(Object);
                expect(typeof responseJson.data.addedComment.id).toBe('string');
                expect(responseJson.data.addedComment.id).not.toEqual('');
                expect(typeof responseJson.data.addedComment.content).toBe(
                    'string'
                );
                expect(responseJson.data.addedComment.content).not.toEqual('');
                expect(typeof responseJson.data.addedComment.owner).toBe(
                    'string'
                );
                expect(responseJson.data.addedComment.owner).not.toEqual('');
            });
        });

        let dicodingCommentId = null;

        describe('Add Comment with User Dicoding', () => {
            let response = null;

            beforeAll(async () => {
                response = await server.inject({
                    method: 'POST',
                    url: `/threads/${threadId}/comments`,
                    headers: {
                        Authorization: `Bearer ${accessToken4Dicoding}`,
                    },
                    payload: newComment,
                });

                dicodingCommentId = response.result.data.addedComment.id;
            });

            it('response should have 201 status code', async () => {
                expect(response.statusCode).toEqual(201);
            });

            it('response should have correct property and value', async () => {
                const responseJson = response.result;
                expect(responseJson).toBeInstanceOf(Object);
                expect(responseJson.status).toEqual('success');
                expect(responseJson.data).toBeInstanceOf(Object);
                expect(responseJson.data.addedComment).toBeInstanceOf(Object);
                expect(typeof responseJson.data.addedComment.id).toBe('string');
                expect(responseJson.data.addedComment.id).not.toEqual('');
                expect(typeof responseJson.data.addedComment.content).toBe(
                    'string'
                );
                expect(responseJson.data.addedComment.content).not.toEqual('');
                expect(typeof responseJson.data.addedComment.owner).toBe(
                    'string'
                );
                expect(responseJson.data.addedComment.owner).not.toEqual('');
            });
        });

        describe('Get Commented Thread', () => {
            let response = null;

            beforeAll(async () => {
                response = await server.inject({
                    method: 'GET',
                    url: `/threads/${threadId}`,
                });
            });

            it('should response with status code 200', async () => {
                expect(response.statusCode).toEqual(200);
            });

            it('should contain correct property and value', async () => {
                const responseJson = response.result;

                expect(responseJson).toBeInstanceOf(Object);
                expect(responseJson.status).toEqual('success');
                expect(responseJson.data).toBeInstanceOf(Object);
                expect(responseJson.data.thread).toBeInstanceOf(Object);
                expect(typeof responseJson.data.thread.id).toBe('string');
                expect(responseJson.data.thread.id).not.toEqual('');
                expect(responseJson.data.thread.title).toEqual(thread.title);
                expect(responseJson.data.thread.body).toEqual(thread.body);
                expect(typeof responseJson.data.thread.date).toBe('object');
                expect(responseJson.data.thread.date).not.toEqual('');
                expect(responseJson.data.thread.username).toEqual(
                    user.username
                );
                expect(responseJson.data.thread.comments).toBeInstanceOf(Array);
                expect(responseJson.data.thread.comments).toHaveLength(2);

                const [comment1, comment2] = responseJson.data.thread.comments;

                expect(comment1).toBeInstanceOf(Object);
                expect(typeof comment1.id).toBe('string');
                expect(comment1.username).toEqual(johnDoe.username);
                expect(typeof comment1.date).toBe('object');
                expect(comment1.content).toEqual(newComment.content);

                expect(comment2).toBeInstanceOf(Object);
                expect(typeof comment2.id).toBe('string');
                expect(comment2.username).toEqual(dicoding.username);
                expect(typeof comment2.date).toBe('object');
                expect(comment2.content).toEqual(newComment.content);
            });
        });

        describe('Delete Dicoding Comment with No Authentication', () => {
            let response = null;

            beforeAll(async () => {
                response = await server.inject({
                    method: 'DELETE',
                    url: `/threads/${threadId}/comments/${dicodingCommentId}`,
                });
            });

            it('should response 401 status code', async () => {
                expect(response.statusCode).toEqual(401);
            });

            it('should show Missing Authentication message', async () => {
                const responseJson = response.result;

                expect(responseJson).toBeInstanceOf(Object);
                expect(responseJson.message).toEqual('Missing authentication');
            });
        });

        describe('Delete Not Found Comment', () => {
            let response = null;
            beforeAll(async () => {
                response = await server.inject({
                    method: 'DELETE',
                    url: `/threads/${threadId}/comments/not-found-comment-id`,
                    headers: {
                        Authorization: `Bearer ${accessToken4JohnDoe}`,
                    },
                });
            });

            it('should response 404 status code', async () => {
                expect(response.statusCode).toEqual(404);
            });

            it('should show Missing Authentication message', async () => {
                const responseJson = response.result;

                expect(responseJson).toBeInstanceOf(Object);
                expect(responseJson.status).toEqual('fail');
                expect(typeof responseJson.message).toBe('string');
                expect(responseJson.message).not.toEqual('');
            });
        });

        describe('Delete Dicoding Comment with Using Johndoe', () => {
            let response = null;
            beforeAll(async () => {
                response = await server.inject({
                    method: 'DELETE',
                    url: `/threads/${threadId}/comments/${dicodingCommentId}`,
                    headers: {
                        Authorization: `Bearer ${accessToken4JohnDoe}`,
                    },
                });
            });

            it('should response 403 status code', async () => {
                expect(response.statusCode).toEqual(403);
            });

            it('should show Missing Authentication message', () => {
                const responseJson = response.result;

                expect(responseJson).toBeInstanceOf(Object);
                expect(responseJson.status).toEqual('fail');
                expect(typeof responseJson.message).toBe('string');
                expect(responseJson.message).not.toEqual('');
            });
        });

        describe('Delete Dicoding Comment with Using Dicoding', () => {
            let response = null;
            beforeAll(async () => {
                response = await server.inject({
                    method: 'DELETE',
                    url: `/threads/${threadId}/comments/${dicodingCommentId}`,
                    headers: {
                        Authorization: `Bearer ${accessToken4Dicoding}`,
                    },
                });
            });

            it('should response 200 status code', async () => {
                expect(response.statusCode).toEqual(200);
            });

            it('should show Missing Authentication message', () => {
                const responseJson = response.result;

                expect(responseJson).toBeInstanceOf(Object);
                expect(responseJson.status).toEqual('success');
            });
        });

        describe('Get Thread After Dicoding Comment Deleted', () => {
            let response = null;

            beforeAll(async () => {
                response = await server.inject({
                    method: 'GET',
                    url: `/threads/${threadId}`,
                });
            });

            it('should response with status code 200', async () => {
                expect(response.statusCode).toEqual(200);
            });

            it('should contain correct property and value', async () => {
                const responseJson = response.result;

                expect(responseJson).toBeInstanceOf(Object);
                expect(responseJson.status).toEqual('success');
                expect(responseJson.data).toBeInstanceOf(Object);
                expect(responseJson.data.thread).toBeInstanceOf(Object);
                expect(typeof responseJson.data.thread.id).toBe('string');
                expect(responseJson.data.thread.id).not.toEqual('');
                expect(responseJson.data.thread.title).toEqual(thread.title);
                expect(responseJson.data.thread.body).toEqual(thread.body);
                expect(typeof responseJson.data.thread.date).toBe('object');
                expect(responseJson.data.thread.date).not.toEqual('');
                expect(responseJson.data.thread.username).toEqual(user.username);
                expect(responseJson.data.thread.comments).toBeInstanceOf(Array);
                expect(responseJson.data.thread.comments).toHaveLength(2);

                const [comment1, comment2] = responseJson.data.thread.comments;

                expect(comment1).toBeInstanceOf(Object);
                expect(typeof comment1.id).toBe('string');
                expect(comment1.username).toEqual(johnDoe.username);
                expect(typeof comment1.date).toBe('object');
                expect(comment1.content).toEqual(newComment.content);

                expect(comment2).toBeInstanceOf(Object);
                expect(typeof comment2.id).toBe('string');
                expect(comment2.username).toEqual(dicoding.username);
                expect(typeof comment2.date).toBe('object');
                expect(comment2.content).toEqual('**komentar telah dihapus**');
            });
        });
    });
});

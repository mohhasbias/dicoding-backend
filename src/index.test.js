require('dotenv').config();

// infrastructures
const createServer = require('./infrastructures/server');

const dependencyInjection = require('./container4http');

describe('Hapi server test untuk resource thread dan comment', () => {
    const httpConfig = {
        host: process.env.HOST,
        port: process.env.PORT,
    };

    let server = null;

    let accessToken = null;

    beforeAll(async () => {
        server = await createServer(httpConfig, dependencyInjection.routes, {
            logger: dependencyInjection.logger,
        });
        await server.initialize();

        const user = {
            username: `test_user_${Date.now()}`,
            fullname: 'test user fullname',
            password: 'test_password',
        };

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

        console.log(response.result);

        accessToken = response.result.data.accessToken;

        console.log(accessToken);
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
                expect(typeof responseJson.data.addedThread.title).toBe('string');
                expect(responseJson.data.addedThread.title).not.toEqual('');
                expect(typeof responseJson.data.addedThread.owner).toBe('string');
                expect(responseJson.data.addedThread.owner).not.toEqual('');
            });
        });
    });

    describe('Resource /comments', () => {
        test.todo('Add Comment with No Authentication');
        test.todo('Add Comment with Not Found Thread');
        test.todo('Add Comment with Invalid Payload');
        test.todo('Add Comment with User Johndoe');
        test.todo('Add Comment with User Dicoding');
        test.todo('Get Commented Thread');
        test.todo('Delete Dicoding Comment with No Authentication');
        test.todo('Delete Not Found Comment');
        test.todo('Delete Dicoding Comment with Using Johndoe');
        test.todo('Delete Dicoding Comment with Using Dicoding');
        test.todo('Get Thread After Dicoding Comment Deleted');
    });
});

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Jwt = require('@hapi/jwt');

const defaultOptions = {
    logger: console,
};

const createServer = async (
    config = { host: 'localhost', port: 3000 },
    routes = [],
    { logger } = defaultOptions
) => {
    const server = Hapi.server({
        host: config.host,
        port: config.port,
    });

    await server.register([
        { plugin: Jwt },
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: {
                info: {
                    title: 'Dicoding Backend',
                },
                securityDefinitions: {
                    jwt: {
                        type: 'apiKey',
                        name: 'Authorization',
                        in: 'header',
                    },
                },
                security: [{ jwt: [] }],
                documentationPath: '/docs',
            },
        },
    ]);

    server.auth.strategy('forum_api_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });

    server.route(routes);

    server.ext('onPreResponse', (request, h) => {
        // mendapatkan konteks response dari request
        const { response } = request;

        // error handler
        if (response.isBoom) {
            console.error(response);
            logger.error(response.output.payload);
            if (response.isJoi) {
                logger.error('isJoi: ' + response.message);
                return h
                    .response({
                        status: 'fail',
                        message:
                            response.message || response.output.payload.message,
                    })
                    .code(400);
            }
            if (response.isDB) {
                logger.error('isDB: ' + response.detail);
                const codes = {
                    'Thread tidak exist': 404,
                    'Comment tidak exist': 404,
                    'Reply tidak exist': 404,
                    'Invalid comment owner': 403,
                    'Invalid reply owner': 403,
                };
                return h
                    .response({
                        status: 'fail',
                        message: response.message,
                    })
                    .code(codes[response.message] || 400);
            }
            if (response.detail) {
                logger.error('detail');
                return h
                    .response({
                        status: 'fail',
                        message: response.detail,
                    })
                    .code(400);
            }
            if (response.isAuthError) {
                logger.error('isAuthError');
                const codes = {
                    'refresh token tidak valid': 400,
                    'refresh token tidak ditemukan di database': 400,
                };
                return h
                    .response({
                        status: 'fail',
                        message:
                            response.message || response.output.payload.message,
                    })
                    .code(codes[response.message] || 401);
            }

            logger.error(JSON.stringify(response));
            return h
                .response({
                    status: 'fail',
                    message:
                        response.message || response.output.payload.message,
                })
                .code(response.output.statusCode);
        }

        // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
        return h.continue;
    });

    return server;
};

module.exports = createServer;

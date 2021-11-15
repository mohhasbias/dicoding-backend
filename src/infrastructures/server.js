const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const logger = require('./logger');

const createServer = async (
    config = { host: 'localhost', port: 3000 },
    routes = []
) => {
    const server = Hapi.server({
        host: config.host,
        port: config.port,
    });

    await server.register([
        {
            plugin: Jwt,
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
                };
                console.error(response);
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
            console.error(response);
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

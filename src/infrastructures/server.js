const Hapi = require('@hapi/hapi');
const logger = require('./logger');

const createServer = async (
    config = { host: 'localhost', port: 3000 },
    routes = []
) => {
    const server = Hapi.server({
        host: config.host,
        port: config.port,
    });

    server.route(routes);

    server.ext('onPreResponse', (request, h) => {
        // mendapatkan konteks response dari request
        const { response } = request;

        // error handler
        if (response.isBoom) {
            logger.error(response.output.payload);
            if (response.isJoi) {
                return h.response({
                    status: 'fail',
                    message: response.message || response.output.payload.message,
                })
                .code(400);
            }
            if (response.isDB) {
                return h.response({
                    status: 'fail',
                    message: response.message,
                })
                .code(400);
            }
            if (response.detail) {
                return h.response({
                    status: 'fail',
                    message: response.detail,
                })
                .code(400);
            }
            return h
                .response({
                    status: 'fail',
                    message: response.output.payload.message,
                })
                .code(response.output.statusCode);
        }

        // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
        return h.continue;
    });

    return server;
};

module.exports = createServer;

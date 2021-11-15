const login = require('../use-cases/login');

const postAuthentications = (services) => async (req, h) => {
    const { logger } = services;
    logger.info('interfaces: post authentications');
    const { accessToken, refreshToken } = await login(req.payload, services);

    return h
        .response({
            status: 'success',
            data: {
                accessToken,
                refreshToken,
            },
        })
        .code(201);
};

module.exports = postAuthentications;

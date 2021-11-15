const refreshAccess = require('../use-cases/refresh-access');

const putAuthentications = (services) => async (req, h) => {
    const { logger } = services;
    logger.info('interfaces: put authentications');
    const { refreshToken } = req.payload;
    const accessToken = await refreshAccess(refreshToken, services);

    return h
        .response({
            status: 'success',
            data: {
                accessToken,
            },
        })
        .code(200);
};

module.exports = putAuthentications;

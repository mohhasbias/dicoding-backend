const logout = require('../use-cases/logout');

const deleteAuthentications = (services) => async (req, h) => {
    const { logger } = services;
    logger.info('interfaces: delete authentications');
    const { refreshToken } = req.payload;
    await logout(refreshToken, services);

    return h
        .response({
            status: 'success',
        })
        .code(200);
};

module.exports = deleteAuthentications;

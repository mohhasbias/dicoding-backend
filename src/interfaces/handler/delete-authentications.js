const logout = require('../../use-cases/logout');

const isTokenExist = require('../repository/authentications/is-token-exist');
const removeRefreshToken = require('../repository/authentications/remove-refresh-token');

const deleteAuthentications = (services) => async (req, h) => {
    const { logger } = services;
    logger.info('interfaces: delete authentications');

    const { refreshToken } = req.payload;

    const injectedServices = {
        ...services,
        isTokenExist: isTokenExist(services),
        removeRefreshToken: removeRefreshToken(services),
    };

    await logout(injectedServices)(refreshToken);

    return {
        status: 'success',
    };
};

module.exports = deleteAuthentications;

// use case
const refreshAccess = require('../../use-cases/refresh-access');

// relevant interfaces
const isTokenExist = require('../repository/authentications/is-token-exist');

// http handler
const putAuthentications = (services) => async (req, h) => {
    const { logger } = services;
    logger.info('interfaces: put authentications');

    // extract http request
    const { refreshToken } = req.payload;

    // inject services
    const injectedServices = {
        ...services,
        isTokenExist: isTokenExist(services),
    };

    // execute http request
    const accessToken = await refreshAccess(injectedServices)(refreshToken);

    // build http response
    return {
        status: 'success',
        data: {
            accessToken,
        },
    };
};

module.exports = putAuthentications;

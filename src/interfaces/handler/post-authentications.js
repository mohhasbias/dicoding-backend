// use case
const login = require('../../use-cases/login');

// relevant interfaces
const verifyUser = require('../repository/users/verify-user');
const addRefreshToken = require('../repository/authentications/add-refresh-token');

// http interface handler
const postAuthentications = (services) => async (req, h) => {
    const { logger } = services;
    logger.info('interfaces: post authentications');

    const injectedServices = {
        ...services,
        verifyUser: verifyUser(services),
        addRefreshToken: addRefreshToken(services),
    };
    const { accessToken, refreshToken } = await login(injectedServices)(req.payload);

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

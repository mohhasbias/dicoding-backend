const Jwt = require('@hapi/jwt');

const refreshAuth =
    ({ refreshAccess, currentUser, verifyAccessToken, logger }) =>
    async (refreshToken) => {
        logger.info('interfaces: refresh authentications');

        const accessToken = await refreshAccess(currentUser.refreshToken);

        currentUser.loggedIn = true;
        currentUser.accessToken = accessToken;

        return {
            status: 'success',
            data: {
                accessToken,
            },
        };
    };

module.exports = refreshAuth;

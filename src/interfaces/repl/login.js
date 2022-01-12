const login =
    ({ login, logger, currentUser, verifyAccessToken }) =>
    async (user) => {
        logger.info('interfaces: add authentications');

        const { accessToken, refreshToken } = await login(user);

        currentUser.loggedIn = true;
        currentUser.id = verifyAccessToken(accessToken).id;
        currentUser.accessToken = accessToken;
        currentUser.refreshToken = refreshToken;

        return {
            status: 'success',
            data: {
                accessToken,
                refreshToken,
            },
        };
    };

module.exports = login;

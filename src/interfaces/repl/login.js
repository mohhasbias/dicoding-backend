const login =
    ({ login, logger }) =>
    async (user) => {
        logger.info('interfaces: post authentications');

        const { accessToken, refreshToken } = await login(user);

        return {
            status: 'success',
            data: {
                accessToken,
                refreshToken,
            },
        };
    };

module.exports = login;

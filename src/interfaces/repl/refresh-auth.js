const refreshAuth =
    ({ refreshAccess, logger }) =>
    async (refreshToken) => {
        logger.info('interfaces: put authentications');

        const accessToken = await refreshAccess(refreshToken);

        return {
            status: 'success',
            data: {
                accessToken,
            },
        };
    };

module.exports = refreshAuth;

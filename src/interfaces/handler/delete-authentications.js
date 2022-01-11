const deleteAuthentications =
    ({ logout, logger }) =>
    async (req, h) => {
        logger.info('interfaces: delete authentications');

        const { refreshToken } = req.payload;

        await logout(refreshToken);

        return {
            status: 'success',
        };
    };

module.exports = deleteAuthentications;

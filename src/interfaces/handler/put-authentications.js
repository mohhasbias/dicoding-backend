// http handler
const putAuthentications =
    ({ refreshAccess, logger }) =>
    async (req, h) => {
        logger.info('interfaces: put authentications');

        // extract http request
        const { refreshToken } = req.payload;

        // execute http request
        const accessToken = await refreshAccess(refreshToken);

        // build http response
        return {
            status: 'success',
            data: {
                accessToken,
            },
        };
    };

module.exports = putAuthentications;

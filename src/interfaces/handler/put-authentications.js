// use case
const refreshAccess = require('../../use-cases/refresh-access');

// http handler
const putAuthentications =
    ({ repository }, { logger }) =>
    async (req, h) => {
        logger.info('interfaces: put authentications');

        // extract http request
        const { refreshToken } = req.payload;

        // inject services
        const injectedServices = {
            isTokenExist: repository.authentications.isTokenExist,
            logger,
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

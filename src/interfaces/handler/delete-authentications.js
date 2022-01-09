const logout = require('../../use-cases/logout');

const deleteAuthentications =
    ({ repository }, { logger }) =>
    async (req, h) => {
        logger.info('interfaces: delete authentications');

        const { refreshToken } = req.payload;

        const injectedServices = {
            isTokenExist: repository.authentications.isTokenExist,
            removeRefreshToken: repository.authentications.removeRefreshToken,
            logger,
        };

        await logout(injectedServices)(refreshToken);

        return {
            status: 'success',
        };
    };

module.exports = deleteAuthentications;

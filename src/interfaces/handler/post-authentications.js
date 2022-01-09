// use case
const login = require('../../use-cases/login');

// http interface handler
const postAuthentications =
    ({ repository }, { logger }) =>
    async (req, h) => {
        logger.info('interfaces: post authentications');

        const injectedServices = {
            isUserExist: repository.users.isUserExist,
            verifyUser: repository.users.verifyUser,
            addRefreshToken: repository.authentications.addRefreshToken,
            logger,
        };
        const { accessToken, refreshToken } = await login(injectedServices)(
            req.payload
        );

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

// http interface handler
const postAuthentications =
    ({ login, logger }) =>
    async (req, h) => {
        logger.info('interfaces: post authentications');

        const { accessToken, refreshToken } = await login(req.payload);

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

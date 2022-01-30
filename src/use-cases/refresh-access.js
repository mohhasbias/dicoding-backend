const refreshAccess =
    ({ isTokenExist, verifyRefreshToken, generateAccessToken, logger }) =>
    async (refreshToken) => {
        logger.info('use cases: refresh access');

        const isExist = await isTokenExist(refreshToken);
        if (!isExist) {
            const err = new Error('refresh token tidak valid');
            err.isAuthError = true;
            throw err;
        }

        const { iat, ...payload } = verifyRefreshToken(refreshToken);

        return generateAccessToken(payload);
    };

module.exports = refreshAccess;

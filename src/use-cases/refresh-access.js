const { verifyRefreshToken, generateAccessToken } = require('./utils');

const refreshAccess = async (refreshToken, { db, logger }) => {
    logger.info('use cases: refresh access');

    const isTokenExist = await db.isTokenExist(refreshToken);
    if (!isTokenExist) {
        const err = new Error('refresh token tidak valid');
        err.isAuthError = true;
        throw err;
    }

    const payload = verifyRefreshToken(refreshToken);

    return generateAccessToken(payload);
};

module.exports = refreshAccess;

const { generateAccessToken, generateRefreshToken } = require('./utils');

const logout = async (refreshToken, { db, logger }) => {
    logger.info('use cases: logout');

    const isTokenExist = await db.isTokenExist(refreshToken);
    if (!isTokenExist) {
        const err = new Error('refresh token tidak ditemukan di database');
        err.isAuthError = true;
        throw err;
    }

    db.removeRefreshToken(refreshToken);

    return {
        loggedOut: true,
    };
};

module.exports = logout;

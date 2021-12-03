const logout = ({ isTokenExist, removeRefreshToken, logger }) => async (refreshToken) => {
    logger.info('use cases: logout');

    const isExist = await isTokenExist(refreshToken);
    if (!isExist) {
        const err = new Error('refresh token tidak ditemukan di database');
        err.isAuthError = true;
        throw err;
    }

    removeRefreshToken(refreshToken);

    return {
        loggedOut: true,
    };
};

module.exports = logout;

const { generateAccessToken, generateRefreshToken } = require('./utils');

const login = async (user, { db, logger }) => {
    logger.info('use cases: login');
    const { isVerified: isVerifiedUser, id } = await db.verifyUser(user);
    if (!isVerifiedUser) {
        const e = new Error('Invalid Username or Password');
        e.isAuthError = true;
        throw e;
    }

    const accessToken = generateAccessToken({ id });
    const refreshToken = generateRefreshToken({ id });

    db.addRefreshToken(refreshToken);

    return {
        accessToken,
        refreshToken,
    };
};

module.exports = login;

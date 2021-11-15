const { generateAccessToken, generateRefreshToken } = require('./_utils');

const login = ({verifyUser, addRefreshToken, logger}) => async (user) => {
    logger.info('use cases: login');
    const { isVerified: isVerifiedUser, id } = await verifyUser(user);
    if (!isVerifiedUser) {
        const e = new Error('Invalid Username or Password');
        e.isAuthError = true;
        throw e;
    }

    const accessToken = generateAccessToken({ id });
    const refreshToken = generateRefreshToken({ id });

    addRefreshToken(refreshToken);

    return {
        accessToken,
        refreshToken,
    };
};

module.exports = login;

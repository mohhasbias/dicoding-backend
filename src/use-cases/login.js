const login = ({isUserExist, verifyUser, generateAccessToken, generateRefreshToken, addRefreshToken, logger}) => async (user) => {
    logger.info('use cases: login');

    const isExist = await isUserExist(user);
    logger.info('isExist: ' + isExist);
    if (!isExist) {
        const err = new Error('username tidak exist');
        err.isDB = true;
        throw err;
    }

    const { isVerified: isVerifiedUser, id } = await verifyUser(user);
    logger.info(isVerifiedUser);
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

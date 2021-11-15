const Jwt = require('@hapi/jwt');

const generateAccessToken = (payload) =>
    Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);

const generateRefreshToken = (payload) =>
    Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY);

const verifyRefreshToken = (refreshToken) => {
    try {
        const artifacts = Jwt.token.decode(refreshToken);
        Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
        const { payload } = artifacts.decoded;
        return payload;
    } catch (e) {
        const err = new Error('Invalid refresh token');
        err.isAuthError = true;
        throw err;
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
};

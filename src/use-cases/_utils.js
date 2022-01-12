const Jwt = require('@hapi/jwt');
const logger = require('../infrastructures/logger');

const generateAccessToken = (payload) =>
    Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY, { now: Date.now()});

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

const verifyAccessToken = (accessToken) => {
    try {
        const artifacts = Jwt.token.decode(accessToken);
        Jwt.token.verify(artifacts, process.env.ACCESS_TOKEN_KEY, {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        });
        const { payload } = artifacts.decoded;
        return payload;
    } catch (err) {
        err.isAuthError = true;
        throw err;
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    verifyAccessToken,
};

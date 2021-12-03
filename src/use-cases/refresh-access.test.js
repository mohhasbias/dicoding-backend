const Jwt = require('@hapi/jwt');

const { generateRefreshToken } = require('./_utils');

const refreshAccess = require('./refresh-access');

describe('refresh access', () => {
    it('should refresh access token', async () => {
        const mockService = {
            isTokenExist: () => Promise.resolve(true),
            logger: { info: () => {} },
        };

        const id = 'userId';
        const refreshToken = generateRefreshToken({ id });

        const result = await refreshAccess(mockService)(refreshToken);
        const artifacts = Jwt.token.decode(result);

        expect(artifacts.decoded.payload.id).toEqual(id);
    });

    it('should reject non existent refresh token', async () => {
        const mockService = {
            isTokenExist: () => Promise.resolve(false),
            logger: { info: () => {} },
        };

        await refreshAccess(mockService)().catch((e) => {
            expect(e).toHaveProperty('isAuthError');
        });
    });

    it('should reject invalid refresh token', async () => {
        const mockService = {
            isTokenExist: () => Promise.resolve(true),
            logger: { info: () => {} },
        };

        const invalidRefreshToken = Jwt.token.generate({}, 'random-secret');

        await refreshAccess(mockService)(invalidRefreshToken).catch((e) => {
            expect(e).toHaveProperty('isAuthError');
        });
    });
});

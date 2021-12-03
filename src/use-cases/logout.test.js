const logout = require('./logout');

describe('logout', () => {
    it('should logout', async () => {
        const mockService = {
            isTokenExist: () => Promise.resolve(true),
            removeRefreshToken: () => Promise.resolve(true),
            logger: { info: () => {} },
        };

        const result = await logout(mockService)();

        expect(result).toHaveProperty('loggedOut');
    });

    it('should reject non existent refresh token', async () => {
        const mockService = {
            isTokenExist: () => Promise.resolve(false),
            logger: { info: () => {} },
        };

        await logout(mockService)().catch((e) => {
            expect(e).toHaveProperty('isAuthError');
        });
    });
});

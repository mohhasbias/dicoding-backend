const login = require('./login');

describe('login', () => {
    it('should generate token', async () => {
        const mockService = {
            isUserExist: () => Promise.resolve(true),
            verifyUser: () =>
                Promise.resolve({ isVerified: true, id: 'userId' }),
            addRefreshToken: () => Promise.resolve(true),
            logger: { info: () => {} },
        };

        const result = await login(mockService)();

        expect(result).toHaveProperty('accessToken');
        expect(result).toHaveProperty('refreshToken');
    });

    it('should reject non existent user', async () => {
        const mockService = {
            isUserExist: () => Promise.resolve(false),
            logger: { info: () => {} },
        };

        await login(mockService)().catch((e) => {
            expect(e).toHaveProperty('isDB');
        });
    });

    it('should reject non verified user', async () => { 
        const mockService = {
            isUserExist: () => Promise.resolve(true),
            verifyUser: () => Promise.resolve({ isVerified: false }),
            logger: { info: () => {} },
        };

        await login(mockService)().catch((e) => {
            expect(e).toHaveProperty('isAuthError');
        });
    })
});

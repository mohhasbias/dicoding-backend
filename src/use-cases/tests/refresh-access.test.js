const refreshAccess = require('../refresh-access');

describe('refresh access', () => {
    it('should refresh access token', async () => {
        const mockService = {
            isTokenExist: jest.fn().mockResolvedValue(true),
            verifyRefreshToken: jest
                .fn()
                .mockResolvedValue({ iat: Date.now(), id: 'userId' }),
            generateAccessToken: jest.fn().mockReturnValue('accessToken'),
            logger: { info: () => {} },
        };

        const id = 'userId';
        const refreshToken = 'refreshToken';

        const result = await refreshAccess(mockService)(refreshToken);

        expect(mockService.isTokenExist).toHaveBeenCalled();
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
            verifyRefreshToken: jest.fn(() => {
                throw new Error('refresh token tidak valid');
            }),
            logger: { info: () => {} },
        };

        // await refreshAccess(mockService)(invalidRefreshToken).catch((e) => {
        //     expect(e).toHaveProperty('isAuthError');
        // });

        await refreshAccess(mockService)('invalidRefreshToken').catch((e) => {
            expect(e.message).toBe('refresh token tidak valid');
            expect(mockService.verifyRefreshToken).toHaveBeenCalled();
        });
    });
});

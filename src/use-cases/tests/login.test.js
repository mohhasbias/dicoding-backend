const login = require('../login');

describe('login', () => {
    it('should generate token', async () => {
        const mockService = {
            isUserExist: jest.fn().mockResolvedValue(true),
            verifyUser: jest.fn().mockResolvedValue({ isVerified: true, id: 'userId' }),
            generateAccessToken: jest.fn().mockReturnValue('accessToken'),
            generateRefreshToken: jest.fn().mockReturnValue('refreshToken'),
            addRefreshToken: jest.fn().mockResolvedValue(true),
            logger: { info: () => {} },
        };

        const result = await login(mockService)();

        expect(result).toHaveProperty('accessToken');
        expect(result).toHaveProperty('refreshToken');

        expect(mockService.isUserExist).toHaveBeenCalled();
        expect(mockService.verifyUser).toHaveBeenCalled();
        expect(mockService.addRefreshToken).toHaveBeenCalled();
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

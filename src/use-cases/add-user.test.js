const addUser = require('./add-user');

describe('add user', () => {
    it('should add user', async () => {
        const mockService = {
            isUserExist: () => Promise.resolve(false),
            insertUser: (user) => user,
            logger: {
                info: () => {},
            },
        };

        const user = {
            username: 'username',
            password: 'password',
            fullname: 'fullname',
        };

        const result = await addUser(mockService)(user);

        expect(result).toHaveProperty('username');
        expect(result).toHaveProperty('password');
        expect(result).toHaveProperty('fullname');
    });

    it('should reject invalid user data', async () => {
        const mockService = {
            logger: {
                info: () => {},
            },
        };

        const invalidUserData = [
            { username: 'user' },
            { password: 'pass' },
            { fullname: 'name' },
            {
                username: 'name with space',
                password: 'password',
                fullname: 'fullname',
            },
        ];

        const results = invalidUserData.map(async (u) => {
            await addUser(mockService)(u).catch((e) => {
                expect(e).toHaveProperty('isJoi');
            });
        });
        await Promise.all(results);
    });

    it('should user if already exist', async () => {
        const mockService = {
            isUserExist: () => Promise.resolve(true),
            logger: {
                info: () => {},
            },
        };

        const user = {
            username: 'username',
            password: 'password',
            fullname: 'fullname',
        };

        await addUser(mockService)(user).catch((e) => {
            expect(e).toHaveProperty('isDB');
        });
    });
});

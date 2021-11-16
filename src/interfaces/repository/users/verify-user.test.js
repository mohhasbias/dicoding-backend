const db = require('../../../infrastructures/db');
const logger = require('../../../infrastructures/logger');

const verifyUser = require('./verify-user');

describe('verify user', () => {
    it('should verify user', async () => {
        const user = {
            username: 'dicoding_1637055727',
            password: 'secret',
            fullname: 'Dicoding Indonesia',
        };

        const spyUser = jest.spyOn(db, 'user');

        const result = await verifyUser({ db, logger })(user);

        expect(spyUser).toHaveBeenCalled();
        expect(result).toHaveProperty('isVerified');
        expect(result).toHaveProperty('id');

        spyUser.mockImplementation(() => {
            throw new Error();
        });
        
        expect.assertions(4);
        await verifyUser({ db, logger })(user).catch((e) => {
            expect(e).toHaveProperty('isDB');
        });
    });
});

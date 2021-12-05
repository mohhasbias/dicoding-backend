const db = require('../../../infrastructures/db');
const logger = require('../../../infrastructures/logger');

const insertUser = require('./insert-user');
const verifyUser = require('./verify-user');

describe('verify user', () => {
    const services = {
        db,
        logger,
    };

    it('should verify user', async () => {
        const user = {
            username: 'dicoding_' + Date.now(),
            password: 'secret',
            fullname: 'Dicoding Indonesia',
        };

        await insertUser(services)(user);

        const result = await verifyUser(services)(user);

        expect(result.isVerified).toBeTruthy();
    });

    it('should throw an error on query error', async () => {
        jest.spyOn(db, 'user');

        db.user.mockImplementation(() => {
            throw new Error('simulate query error');
        });

        await verifyUser(services)({}).catch((e) => {
            expect(e).toHaveProperty('isDB');
        });

        db.user.mockRestore();
    });
});

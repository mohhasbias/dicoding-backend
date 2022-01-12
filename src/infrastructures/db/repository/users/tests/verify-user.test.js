const { createDbConnection } = require('.src/infrastructures/db');
const logger = require('./src/infrastructures/logger');

const environment = 'development';
const config = require('./src/knexfile')[environment];

const db = createDbConnection(config, { logger });

const insertUser = require('../insert-user');
const verifyUser = require('../verify-user');

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

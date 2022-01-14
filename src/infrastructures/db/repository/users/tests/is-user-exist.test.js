const { createDbConnection } = require('.src/infrastructures/db');
const logger = require('./src/infrastructures/logger');

const environment = 'development';
const config = require('./src/infrastructures/db/knexfile')[environment];

const db = createDbConnection(config, { logger });

const insertUser = require('../insert-user');

const isUserExist = require('../is-user-exist');

describe('is user exist', () => {
    const services = {
        db,
        logger,
    };

    it('should return true if user exists', async () => {
        const user = {
            username: 'username',
            fullname: 'fullname',
            password: 'password',
        };

        await insertUser(services)(user);

        const result = await isUserExist(services)(user);

        expect(result).toBeTruthy();
    });

    it('should return false if user does not exists', async () => {
        const result = await isUserExist(services)({
            username: 'non existent username',
        });

        expect(result).toBeFalsy();
    });

    it('should catch database error', async () => {
        jest.spyOn(db, 'user');

        db.user.mockImplementation(() => {
            throw new Error('simulate query error');
        });

        await isUserExist(services)({ username: 'username' }).catch((e) => {
            expect(e).toHaveProperty('isDB');
        });

        db.user.mockRestore();
    });
});

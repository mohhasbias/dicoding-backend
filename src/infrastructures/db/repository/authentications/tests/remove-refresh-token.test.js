const { createDbConnection } = require('.src/infrastructures/db');
const logger = require('./src/infrastructures/logger');

const environment = 'development';
const config = require('./src/infrastructures/db/knexfile')[environment];

const db = createDbConnection(config, { logger });

const addRefreshToken = require('../add-refresh-token');
const removeRefreshToken = require('../remove-refresh-token');
const isTokenExist = require('../is-token-exist');

describe('remove refresh token', () => {
    const services = {
        db,
        logger,
    };

    it('should remove refresh token', async () => {
        const refreshToken = 'refresh_token' + Date.now();

        const { token: addedToken } = await addRefreshToken(services)(refreshToken);

        expect(addedToken).toEqual(refreshToken);

        const isExistBefore = await isTokenExist(services)(refreshToken);

        expect(isExistBefore).toBeTruthy();

        await removeRefreshToken(services)(refreshToken);

        const isExistAfter = await isTokenExist(services)(refreshToken);

        expect(isExistAfter).toBeFalsy();
    });

    it('should throw an error on query error', async () => {
        jest.spyOn(db, 'authentications');

        db.authentications.mockImplementation(() => {
            throw new Error('simulate query error');
        })

        await removeRefreshToken(services)('refresh_token').catch((e) => {
            expect(e).toHaveProperty('isDB');
        });

        db.authentications.mockRestore();
    })
});

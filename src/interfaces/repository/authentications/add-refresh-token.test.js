const db = require('../../../infrastructures/db');
const logger = require('../../../infrastructures/logger');

const addRefreshToken = require('./add-refresh-token');
const isTokenExist = require('./is-token-exist');

describe('add refresh token', () => {
    const services = {
        db,
        logger,
    };

    it('should add a refresh token', async () => {
        const refreshToken = 'refreshToken';

        const result = await addRefreshToken(services)(refreshToken);

        expect(result.token).toEqual(refreshToken);

        const isExist = await isTokenExist(services)(refreshToken);

        expect(isExist).toBeTruthy();
    });

    it('should throw an error on query error', async () => {
        jest.spyOn(db, 'authentications');

        db.authentications.mockImplementation(() => {
            throw new Error('simulate query error');
        });

        await addRefreshToken(services)('a token').catch((e) => {
            expect(e).toHaveProperty('isDB');
        });
    });
});

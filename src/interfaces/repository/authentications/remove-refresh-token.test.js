const db = require('../../../infrastructures/db');
const logger = require('../../../infrastructures/logger');

const addRefreshToken = require('./add-refresh-token');
const removeRefreshToken = require('./remove-refresh-token');

describe('remove refresh token', () => {
    const services = {
        db,
        logger,
    };

    it('should remove refresh token', async () => {
        const refreshToken = 'refresh_token' + Date.now();

        const { token: addedToken } = await addRefreshToken(services)(refreshToken);

        expect(addedToken).toEqual(refreshToken);

        const numRemoved = await removeRefreshToken(services)(addedToken);

        expect(numRemoved).toBe(1);
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

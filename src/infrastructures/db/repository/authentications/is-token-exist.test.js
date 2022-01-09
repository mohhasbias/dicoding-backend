const { createDbConnection } = require('.src/infrastructures/db');
const logger = require('./src/infrastructures/logger');

const environment = 'development';
const config = require('./src/knexfile')[environment];

const db = createDbConnection(config, { logger });

const addRefreshToken = require('./add-refresh-token');
const isTokenExist = require('./is-token-exist');

describe('is token exist', () => {
    it('should return true if token exist', async () => {
        const refreshToken = 'a refresh token';
        await addRefreshToken({ db, logger })(refreshToken);

        const result = await isTokenExist({ db, logger })(refreshToken);

        expect(result).toBeTruthy();
    });

    it('should return false if token non exist', async () => {
        const result = await isTokenExist({ db, logger })(null);

        expect(result).toBeFalsy();
    });

    it('should throw on query error', async () => {
        jest.spyOn(db, 'authentications');

        db.authentications.mockImplementation(() => {
            throw new Error('simulate query error');
        });
        
        await isTokenExist({ db, logger })().catch((e) => {
            expect(e).toHaveProperty('isDB');
        });
    });
});

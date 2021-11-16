const db = require('../../../infrastructures/db');
const logger = require('../../../infrastructures/logger');

const isTokenExist = require('./is-token-exist');

describe('is token exist', () => {
    it('should check is token exist', async () => {
        const spyAuthentications = jest.spyOn(db, 'authentications');

        const result = await isTokenExist({ db, logger })(null);

        expect(spyAuthentications).toHaveBeenCalled();
        expect(result).toBeFalsy();

        spyAuthentications.mockImplementation(() => {
            throw new Error();
        });
        
        expect.assertions(3);
        await isTokenExist({ db, logger })(null).catch((e) => {
            expect(e).toHaveProperty('isDB');
        });
    });
});

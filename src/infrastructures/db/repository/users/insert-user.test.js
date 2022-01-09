const { createDbConnection } = require('.src/infrastructures/db');
const logger = require('./src/infrastructures/logger');

const environment = 'development';
const config = require('./src/knexfile')[environment];

const db = createDbConnection(config, { logger });

const insertUser = require('./insert-user');

describe('insert user', () => {
    it('should insert user', async () => {
        const user = {
            username: 'dicoding_1637055727',
            password: 'secret',
            fullname: 'Dicoding Indonesia',
        };

        const spyUser = jest.spyOn(db, 'user');

        const result = await insertUser({ db, logger })(user);

        expect(spyUser).toHaveBeenCalled();
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('username');
        expect(result).toHaveProperty('fullname');

        expect.assertions(5);
        await insertUser({ db, logger })({ ...user, fullname: null }).catch((e) => {
            expect(e).toHaveProperty('isDB');
        });
    });
});

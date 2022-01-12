const newUser = require('../user');

describe('users', () => {
    it('should validate', () => {
        const badAuthenticationPayloads = [
            {},
            { password: 'secret', fullname: 'Dicoding Indonesia' },
            { username: 123, password: 'secret', fullname: 'Dicoding Indonesia' },
            { username: 'dicoding', fullname: 'Dicoding Indonesia' },
            { username: 'dicoding', password: true, fullname: 'Dicoding Indonesia' },
            { username: 'dicoding', password: 'secret' },
            { username: 'dicoding', password: 'secret', fullname: [] },
        ];

        badAuthenticationPayloads.map((c) => {
            expect(() => newUser(c)).toThrow();
        });

        const validUserPayload = {
            "username": "dicoding_1637058870",
            "password": "secret",
            "fullname": "Dicoding Indonesia"
        };

        expect(() => newUser(validUserPayload)).not.toThrow();
    });
});

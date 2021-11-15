const newUser = require('../entities/user');

const addUser =
    ({ isUserExist, insertUser, logger }) =>
    async (user) => {
        logger.info('use cases: add user');
        let validatedUser = {};
        try {
            validatedUser = newUser(user);
        } catch (err) {
            const e = new Error(
                'tidak dapat membuat user baru karena ' + err.details[0].message
            );
            e.isJoi = true;
            throw e;
        }

        const isExist = await isUserExist(validatedUser);
        logger.info('isExist: ' + isExist);
        if (isExist) {
            const err = new Error('username tidak tersedia');
            err.isDB = true;
            throw err;
        }

        const addedUser = await insertUser(validatedUser);

        logger.info('use-cases: added user');
        logger.info(JSON.stringify(addedUser, null, 2));

        return addedUser;
    };

module.exports = addUser;

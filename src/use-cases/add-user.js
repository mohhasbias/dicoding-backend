const newUser = require('../entities/user');

const addUser = async (user, { db, logger }) => {
    logger.info('use cases: add user');
    let validatedUser = {};
    try {
        validatedUser = newUser(user);
    } catch (err) {
        const e = new Error('tidak dapat membuat user baru karena ' + err.details[0].message)
        e.isJoi = true;
        throw e;
    }

    const isExist = await db.isUserExist(validatedUser);
    logger.info('isExist: ' + isExist);
    if (isExist) {
        const err = new Error('username tidak tersedia');
        err.isDB = true;
        throw err;
    }

    const addedUser = await db.insertUser(validatedUser);

    logger.info('use-cases: added user');
    logger.info(JSON.stringify(addedUser, null, 2));

    return addedUser;
};

module.exports = addUser;

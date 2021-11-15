const { hash, generateID } = require('./utils');

const insertUser =
    ({ db, logger }) =>
    async (user) => {
        logger.info('interfaces: insert user');
        const { username, fullname, password } = user;
        logger.info(username);

        try {
            const id = await generateID();
            logger.info('inserting to database with id: ' + id);
            const result = await db
                .user()
                .insert({
                    id,
                    username,
                    fullname,
                    password: hash(password),
                })
                .returning(['id', 'username', 'fullname']);

            logger.info('interfaces: user inserted');
            logger.info(JSON.stringify(result[0], null, 2));

            return result[0];
        } catch (e) {
            console.log('Error insert user');
            e.isDB = true;
            throw e;
        }
    };

module.exports = insertUser;

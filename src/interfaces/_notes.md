handler:
- an http handler
- needs infrastructure
- accept http request object
- import/require relevant interfaces such as repository
- extract http request
- inject services such as connecting repository to db infrastructure
- execute use case
- build http response

Example:
```javascript
// use case
const addUser = require('../../use-cases/add-user');

// relevant interfaces
const isUserExist = require('../repository/users/is-user-exist');
const insertUser = require('../repository/users/insert-user');

// http handler
const postUser = (services) => async (req, h) => {
    const { logger } = services;
    logger.info('interfaces: post user');

    // extract http request
    const user = req.payload;

    // inject services
    const injectedServices = {
        ...services,
        isUserExist: isUserExist(services),
        insertUser: insertUser(services),
    };

    // execute use case
    const addedUser = await addUser(injectedServices)(user);

    // build http response
    return h
        .response({
            status: 'success',
            data: {
                addedUser,
            },
        })
        .code(201);
};

module.exports = postUser;
```

repository
- needs db infrastructure
- execute query on db infrastructure

Example:
```javascript
const { hash, generateID } = require('../../_utils');

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
```

Common infrastructure function signature
```javascript
const interfaceName =
    (expectedService) =>
    (expectedParams) => {
        // interface definition
    };
```
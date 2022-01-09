// use case
const addUser = require('../../use-cases/add-user');

// http handler
const postUser =
    ({ repository }, { logger }) =>
    async (req, h) => {
        logger.info('interfaces: post user');

        // extract http request
        const user = req.payload;

        console.log(repository);

        // inject services
        const injectedServices = {
            isUserExist: repository.users.isUserExist,
            insertUser: repository.users.insertUser,
            logger,
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

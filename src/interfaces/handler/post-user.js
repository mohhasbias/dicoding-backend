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

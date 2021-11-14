const logger = require('../infrastructures/logger');
const addUser = require('../use-cases/add-user');

const postUser = (services) => async (req, h) => {
    logger.info('interfaces: post user');
    const addedUser = await addUser(req.payload, services);

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

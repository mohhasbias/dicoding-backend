// http handler
const postUser =
    ({ addUser, logger }) =>
    async (req, h) => {
        logger.info('interfaces: post user');

        // extract http request
        const user = req.payload;

        // execute use case
        const addedUser = await addUser(user);

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

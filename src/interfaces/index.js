const postUser = require('./post-user');

const insertUser = require('./insert-user');
const isUserExist = require('./is-user-exist');

module.exports = (services) => {
    const dbHandler = {
        insertUser: insertUser(services),
        isUserExist: isUserExist(services),
    };

    const injectedServices = {
        ...services,
        db: dbHandler
    }

    return [{ method: 'POST', path: '/users', handler: postUser(injectedServices) }];
};

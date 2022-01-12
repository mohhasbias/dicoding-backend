const logout =
    ({ logout, currentUser, logger }) =>
    async () => {
        logger.info('interfaces: delete authentications');

        await logout(currentUser.refreshToken);

        currentUser.loggedIn = false;
        currentUser.id = null;
        currentUser.refreshToken = null;

        return {
            status: 'success',
        };
    };

module.exports = logout;

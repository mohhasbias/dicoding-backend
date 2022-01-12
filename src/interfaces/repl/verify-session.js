const verifySession =
    ({ currentUser, verifyAccessToken, refreshAuth }) =>
    async () => {
        if (!currentUser.loggedIn) {
            throw new Error('not logged in');
        }

        try {
            verifyAccessToken(currentUser.accessToken);
        } catch (e) {
            currentUser.loggedIn = false;
            currentUser.accessToken = null;
            e.isAuthError = true;
            throw e;
        }

        if (!currentUser.loggedIn && currentUser.refreshToken) {
            try {
                refreshAuth();
            } catch (e) {
                currentUser.refreshToken = null;
            }
        }

        return true;
    };

module.exports = verifySession;

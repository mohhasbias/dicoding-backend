const createRoutes = (services, routes, options = { logger: console }) => {
    return routes.map((route) => {
        return {
            ...route,
            handler: route.handler(services, options)
        }
    });
};

module.exports = createRoutes;

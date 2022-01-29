const config = {
    moduleNameMapper: {
        'src/(.*)': ['<rootDir>/src/$1'],
    },
    setupFiles: ['dotenv/config'],
};

module.exports = config;

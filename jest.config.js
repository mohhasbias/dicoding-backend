const config = {
    globalSetup: '<rootDir>/jest.repository.setup.js',
    globalTeardown: '<rootDir>/jest.repository.teardown.js',
    moduleNameMapper: {
        "src/(.*)": [
            "<rootDir>/src/$1",
          ]
    }
};

module.exports = config;

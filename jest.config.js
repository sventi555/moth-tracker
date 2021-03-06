module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        './server/**/*.js',
        '!**/*.test.js'
    ],
    coverageDirectory: './coverage',
    coverageReporters: [
        'text',
        'cobertura'
    ],
    clearMocks: true,
    displayName: 'server',
    rootDir: __dirname,
    testEnvironment: 'node',
    testRegex: './server/.*\\.(test)\\.js$'
};

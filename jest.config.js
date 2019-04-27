module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        './src/**/*.js',
        '!**/*.test.js'
    ],
    coverageDirectory: './coverage',
    coverageReporters: [
        'text',
        'cobertura'
    ],
    clearMocks: true,
    displayName: 'moth-tracker',
    rootDir: __dirname,
    testEnvironment: 'node',
    testRegex: './server/.*\\.(test)\\.js$'
};

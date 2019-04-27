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
    setupFiles: ['./jest.setup.js'],
    testEnvironment: 'node',
    testRegex: './server/.*\\.(test)\\.js$'
};

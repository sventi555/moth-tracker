module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        './**/*.js',
        '!**/*.test.js'
    ],
    coverageDirectory: './coverage',
    coverageReporters: [
        'text',
        'cobertura'
    ],
    clearMocks: true,
    displayName: 'client',
    rootDir: __dirname,
    testEnvironment: 'node',
    testRegex: './.*\\.(test)\\.js$'
};

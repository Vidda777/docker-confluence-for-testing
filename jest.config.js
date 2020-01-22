module.exports = {
    verbose: true,
    preset: "jest-puppeteer",
    globals: {
        TIMEOUT: 180000,
    },
    globalSetup: './setup/global-setup.js',
    reporters: ['default', 'jest-mocha-reporter']
} 
module.exports = {
    exitOnPageError: false,
    browserContext: 'incognito',
    launch: {
      headless: process.env.HEADLESS !== 'false',
      slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0,
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
      ignoreHTTPSErrors: true,
    },
  };
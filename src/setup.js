const puppeteer = require('puppeteer');

const BASE_PATH = 'http://localhost:8090/confluence';
const CONFLUENCE_LICENCE = `AAABUQ0ODAoPeNptUM1LwzAUv+evCHhRsCOtdGWDgtJW3KztWOf04CVmb1sgTUs+ivvvTT8OO+wQe
OT9Pt/dFxzw2kpMQkzIMoyW4Rwn6Q4HxF+gwta/oMrjpwalY58QlIJmireGNzJOGnkUFiQDfF+B6
kA9YIfBA/pniVPoQDQtKJxzBlIDShTQnppSA3Hv4JG5R0LklAxlpqA1xJoK0M+sqalwKHaeuRExZ
zVzCN5BbJSF8aMyVBlQ8ZGKXnwUyT4oF7dVso4KOwSYKIPKFG53aWEIkGb7LC832RaJcbN3dXpOg
Jy0NCCpq5z9tVxdpiIB8Ujk+REq1YlKrul0n94d75y9bERzuuCqEbZf6Ue8kmyGxqut0viFbLZe8
brOvfI9+fYWb0GFqqyI3fNy/ynyycKfoympw+er9ObqKpWVgtfcwAFtrGJnquHq6kPYf1d1qOowL
AIUGyVYmdMHcs89VtPGv3rtCk3+psACFAiKiKYLaT+ISnNOEV5wvTmsIBgFX02gk`;

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1280,
    height: 960
  });
  // Setup - page 1
  let url = `${BASE_PATH}/setup/setupstart.action`;
  console.log(`Goto page setup ${url}`);
  await page.goto(url);
  if (url == await page.evaluate(() => document.location.href)) {
    await page.click('.confluence-setup-choice-box-header');
    await page.click('#setup-next-button');
  }

  // Setup - page 2
  await page.waitFor(2000);
  url = `${BASE_PATH}/setup/evallicense.action`;
  console.log(`wait page setup ${url}`);
  if (url == await page.evaluate(() => document.location.href)) {
    await page.click('#confLicenseString');
    //await page.keyboard.type(CONFLUENCE_LICENCE);
    await page.evaluate(license => {
      document.getElementById('confLicenseString').value = license;
    }, CONFLUENCE_LICENCE);
    await Promise.all([
      page.click('#setup-next-button'),
      page.waitForNavigation({timeout:0, waitUntil: 'networkidle0' })
    ]);
  }

  // Setup - page 3
  await page.waitFor(2000)
  url = `${BASE_PATH}/setup/setupusermanagementchoice-start.action`;
  console.log(`wait page setup ${url}`);
  if (url == await page.evaluate(() => document.location.href)) {
    await page.click('#internal');
  }

  // Setup - page 4
  await page.waitFor(2000);
  url = `${BASE_PATH}/setup/setupadministrator-start.action`;
  console.log(`wait page setup ${url}`);
  if (url == await page.evaluate(() => document.location.href)) {
    await page.click('#fullName');
    await page.keyboard.type('Mr Admin');

    await page.click('#email');
    await page.keyboard.type('admin@example.com');

    await page.click('#password');
    await page.keyboard.type('admin');

    await page.click('#confirm');
    await page.keyboard.type('admin');

    await page.click('#setup-next-button');
  }

  // Setup - page 5
  await page.waitFor(2000);
  url = `${BASE_PATH}/setup/finishsetup.action`;
  console.log(`wait page setup ${url}`);
  if (url == await page.evaluate(() => document.location.href)) {
    await page.click('#further-configuration');
  }

  // password
  console.log('Enter password');

  await page.waitFor(1000);
  // await  page.keyboard.type(USER.password);
  await  page.keyboard.type('admin');

  // confirm password
  console.log('confirm password');
  await page.waitFor(1000);
  await page.click('#authenticateButton');

  // go to addons
  // click on the gear
  await page.waitFor(3000);
  console.log('click on gear');
  await page.click('#admin-menu-link > span');

  // select addons
  console.log('click on Addons');
  await page.waitFor(1000);
  await page.click('#plugin-administration-link');

  await page.waitFor(3000);

  //here it should be the plugin installation

  await page.screenshot({
    path: 'example.png'
  });

})();
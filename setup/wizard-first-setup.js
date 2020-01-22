const puppeteer = require('puppeteer');

const BASE_PATH = 'http://localhost:8090/confluence';
const CONFLUENCE_LICENCE = `AAABUQ0ODAoPeNptUM1LwzAUv+evCHhRsCOtdGWDgtJW3KztWOf04CVmb1sgTUs+ivvvTT8OO+wQe
OT9Pt/dFxzw2kpMQkzIMoyW4Rwn6Q4HxF+gwta/oMrjpwalY58QlIJmireGNzJOGnkUFiQDfF+B6
kA9YIfBA/pniVPoQDQtKJxzBlIDShTQnppSA3Hv4JG5R0LklAxlpqA1xJoK0M+sqalwKHaeuRExZ
zVzCN5BbJSF8aMyVBlQ8ZGKXnwUyT4oF7dVso4KOwSYKIPKFG53aWEIkGb7LC832RaJcbN3dXpOg
Jy0NCCpq5z9tVxdpiIB8Ujk+REq1YlKrul0n94d75y9bERzuuCqEbZf6Ue8kmyGxqut0viFbLZe8
brOvfI9+fYWb0GFqqyI3fNy/ynyycKfoympw+er9ObqKpWVgtfcwAFtrGJnquHq6kPYf1d1qOowL
AIUGyVYmdMHcs89VtPGv3rtCk3+psACFAiKiKYLaT+ISnNOEV5wvTmsIBgFX02gk`;

const DB_USER = "postgres";
const JDBC_URL = `jdbc:postgresql://${DB_USER}:5432/confluence`;

async function installationTypeSelection(page) {
  console.log(`installation type selection`);
  let url = `${BASE_PATH}/setup/setupstart.action`;
  await page.goto(url);
  if (url == await page.evaluate(() => document.location.href)) {
    await page.click('#custom');
    await page.click('#setup-next-button');
  }
  await page.waitFor(1500);

  url = `${BASE_PATH}/setup/selectbundle.action`;
  if (url == await page.evaluate(() => document.location.href)) {
    await page.click('#setup-next-button');
  }
  await page.waitFor(1500);
}

async function licenseSetup(page) {
  console.log(`license set up`);
  let url = `${BASE_PATH}/setup/setuplicense.action`;
  if (url == await page.evaluate(() => document.location.href)) {
    await page.click('#confLicenseString');
    await page.evaluate(license => {
      document.getElementById('confLicenseString').value = license;
    }, CONFLUENCE_LICENCE);

    await page.click('#setupTypeCustom');
  }
  await page.waitFor(1500)
}

async function configureDatabase(page){
  console.log(`configuring database`);
  let url = `${BASE_PATH}/setup/setupdbchoice-start.action`;
  if (url == await page.evaluate(() => document.location.href)) {
    await page.click('#custom');
    await page.click('#setup-next-button');
  }
  await page.waitFor(1000);

  await page.click('#dbConfigInfo-customize');
  await page.evaluate(db_url => {
    document.getElementById('dbConfigInfo-databaseUrl').value = db_url;
  }, JDBC_URL);

  await page.click('#dbConfigInfo-username');
  await page.keyboard.type(DB_USER);

  await page.click('#dbConfigInfo-password');
  await page.keyboard.type(DB_USER);

  await Promise.all([
    page.click('#setup-next-button'),
    page.waitForNavigation({timeout:0, waitUntil: 'networkidle0' })
  ]);
}

async function userConfigurationSetup(page) {
  console.log(`userConfiguration setup`);
  let url = `${BASE_PATH}/setup/setupdata-start.action`;
  if (url == await page.evaluate(() => document.location.href)) {
    await page.$eval('#blankChoiceForm', form => form.submit());
  }
  await page.waitFor(1000);

  url = `${BASE_PATH}/setup/setupusermanagementchoice-start.action`;
  if (url == await page.evaluate(() => document.location.href)) {
    await page.click('#internal');
  }
  await page.waitFor(1000);

  url = `${BASE_PATH}/setup/setupadministrator-start.action`;
  if (url == await page.evaluate(() => document.location.href)) {
    await page.click('#fullName');
    await page.keyboard.type('Mr Admin');

    await page.click('#email');
    await page.keyboard.type('admin@example.com');

    await page.click('#password');
    await page.keyboard.type('admin');

    await page.click('#confirm');
    await page.keyboard.type('admin');

    await Promise.all([
      page.click('#setup-next-button'),
      page.waitForNavigation({timeout:0, waitUntil: 'networkidle0' })
    ]);

    await page.waitFor(1500);
  }
}

async function finishPageSetup(page) {
  console.log(`finish initial setup`);
  let url = `${BASE_PATH}/setup/finishsetup.action`;
  if (url == await page.evaluate(() => document.location.href)) {
    await page.screenshot({
      path: 'example.png'
    });
  }
}

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

  try{
    // Setup - page 1
    await installationTypeSelection(page);

    // Setup - page 2
    await licenseSetup(page);

    // Setup - page 3
    await configureDatabase(page);

    // Setup - page 4
    await userConfigurationSetup(page);

    // Setup - page 5
    await finishPageSetup(page);
  } catch (error) {
    console.error(`exception thrown ${error}`)
    await browser.close();
  } finally {
    await browser.close();
  }
})();
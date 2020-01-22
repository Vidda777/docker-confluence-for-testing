const puppeteer = require('puppeteer');
const {defaults} = require('jest-config');
const jsonConfig = require("./config.json");
//let url = `${BASE_PATH}/setup/setupstart.action`;
let url2 = jsonConfig.base_path;
describe('Setup', () => {
    beforeAll(async () => {
        const browser = await puppeteer.launch({
            headless: false,
            //slowMo: 100,
        });
        const page = await browser.newPage();
        await page.goto(url2);
    })
    it('should display "Setup is already complete" text on page', async () => {
        await expect(page).toContain("Setup is already complete");
        await page.screenshot({
            path: 'example.png'
        });
    })
    it('should2 display "Setup is already complete" text on page', async () => {
        await expect(page).toContain("Setup is already complete");
        await page.screenshot({
            path: 'example.png'
        });
    })
})
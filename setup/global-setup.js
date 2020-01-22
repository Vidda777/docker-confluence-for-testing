const puppeteer = require('puppeteer');
const { setup: setupPuppeteer } = require('jest-environment-puppeteer');

const CONFLUENCE_LICENSE = "AAABUQ0ODAoPeNptkF1LwzAUhu/zKwLeKNiRtk67QUBci3TUfdi6C/EmxrMtkKYlH8P9e9MPYReDBELOe973OeemcoCXTOEoxuFs7s80xouywhEJE7Ry9Tfo9f7DgDZ0SghKwXAtWisaRReN2ksHigO+LUGfQN9hr8G9+muOUziBbFrQuBAclAG00MC61pRZoF1CQMIgekDeyTJuV6wGapgE88ybmkmv4seJfyLuoyZeIU5ArXYwfJSWaQua7pnszAeT7I0Jed0lOzHpeoCxpXcZ4apzCz1Amu2yYr3J3pEcKjs/TtcTIW+tLCjmR85+W6HPF4MkQUzQWh+YEoaN++nSceXjVSObwxmXjXRdydzjXPEJGraWp/Tl8TMNyONmG7xWeRwsp2SLymxF/Q2KkERxkoQzNJJ6fZGnV0sXVE5JUQsLP2jjND8yA/+wTyPsH16NqLswLAIUOfz385/7lO9xxUXbtdQdmgAoDr8CFFLP12qHiYJjQ6Nk27X7OmGJBAaIX02gk"

module.exports = async function globalSetup(globalConfig) {
  await setupPuppeteer(globalConfig);

    const base_path = process.env.BASE_URL; 

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
    let url = `${base_path}/setup/setupstart.action`;
    console.log(`Goto page setup ${url}`);
    await page.goto(url);
    if (url == await page.evaluate(() => document.location.href)) {
      await page.click('#custom');
      await page.click('#setup-next-button');
    }

};
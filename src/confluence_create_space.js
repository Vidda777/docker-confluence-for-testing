const puppeteer = require('puppeteer');

const LOGIN = async (page, browser) => {
  const USER = {
    username : "admin",
    password : "admin"
  }

  // space name and key
  const spaceName = "space1";
  const spaceKey = "SPACE1";

  // login
  console.log('Confluence login');
  const emailField = await page.$('input[name=os_username]');
  await emailField.click({ delay: 100 });
  await emailField.type(USER.username, { delay: 100 });
  await emailField.dispose();

  // password
  const passwordField = await page.$('input[name=os_password]');
  await passwordField.click({ delay: 100 });
  await passwordField.type(USER.password, { delay: 100 });
  await passwordField.dispose();

  const loginButton = await page.$('input[name=login]');
  await loginButton.focus();
  await loginButton.click({ delay: 100 });
  await loginButton.dispose();
  await page.waitForNavigation();

  // click on spaces
  console.log('Click on Spaces');
  await page.click('#space-menu-link');
  await page.waitFor(2000);


  // click on create space
  console.log('Click on Create Space');
  await page.click('#create-space-header');

  // get popup
  const pages = await browser.pages(); // get all open pages by the browser
  const popup = await pages[pages.length - 1]; // the popup should be the last page opened

  await page.waitFor(3000);

  // click on next button
  console.log('Click on Next button')
  await page.click('#create-dialog > div > div.dialog-button-panel > button');

  await page.waitFor(3000);

  // Space name and key panel
  console.log('enter space name');

  // space Name 
  const spaceNameField = await page.$('input[name=name]');
  await spaceNameField.click({ delay: 100 });
  await spaceNameField.type(spaceName, { delay: 100 });
  await spaceNameField.dispose();

  // space key
  const spaceKeyField = await page.$('input[name=spaceKey]');
  await spaceKeyField.click({ delay: 100 });
  await spaceKeyField.type(spaceKey, { delay: 100 });
  await spaceKeyField.dispose();

  console.log('create space button');

  // create space button
  await popup.click('#create-dialog > div:nth-child(2) > div.dialog-button-panel > button.create-dialog-create-button.aui-button.aui-button-primary');



// console.log('before getELementsByClassName');
//   let texts = await page.evaluate(() => {
//     console.log('jere');
//     let data = [];
//     console.log('before page.getELementsByClassName');
//     // let elements = page.getElementsByClassName('error');
//     let elements = page.querySelector('.error');
//     console.log('ELEMENTS', elements);
//     for (let element of elements) {
//       console.log('element.textContent', element.textContent);
//         data.push(element.textContent);
//     }
//     console.log ('DATA', data);
//   });

  await page.waitFor(3000);
  console.log('is space created?');

  // const textContent = await page.evaluate(() => {
  //   const k = document.querySelectorAll(".error");
  //   console.log('....', k[1].innerHTML);
  //   return k[1].innerHTML;;
  // });

  const textContent = await page.evaluate(() => {
    const k = document.getElementsByClassName("error");
    if (k[1]) {
      console.log('....', k[1].innerHTML);
      return k[1].innerHTML;
    } else {
      return null;
    }
  });


  if (textContent == 'A space with this space key already exists.') {
    console.log('space already exists, remove it');

    // close dialog
    await page.click('#create-dialog > div:nth-child(2) > div.dialog-button-panel > a');

    await page.waitFor(2000);

    // click on spaces
    console.log('Click on Spaces');
    await page.click('#space-menu-link');
    await page.waitFor(2000);

    // click on space to remove
    console.log('click on space to remove');

    const spaceInSpacesSelection = await page.evaluate(() => {
      // const recentSpacesList = document.getElementById('recent-spaces-section').getELement;

      let selectSpace = '';

      const selectSpaceArray = document.querySelectorAll('#recent-spaces-section > ul > li > a');

      selectSpaceArray.forEach((item, i) => {
        console.log('item', item.textContent, 'indecx', i);
        if (item.textContent == 'space1') {
          selectSpace = i;
        }
      });
      
      // const spacesList = recentSpacesList.getElementsByClassName('icon.space-logo');
      console.log('selectSpace', selectSpace);

      return selectSpace;
    });

    await page.waitFor(3000);

    var spaceSelector = '#recent-spaces-section > ul > li:nth-child(' + (spaceInSpacesSelection + 1) + ') > a';
    await page.click(spaceSelector);

    // await page.click('#recent-spaces-section > ul > li:nth-child(1) > a');

    // collapse sidenav
    console.log('click on [')
    await page.keyboard.press("[", {delay: 1000});

    await page.waitFor(1000);

    // goto space tools
    console.log('go to space tools');
    await page.click('#space-tools-menu-trigger > span.aui-icon.aui-icon-small.aui-iconfont-configure ');

    await page.waitFor(1000);

    // click on overview
    console.log('Click on Overview');
    await page.click('#space-tools-menu > div.aui-dropdown2-section.space-tools-navigation > div > ul > li:nth-child(1) > a');

    await page.waitFor(1000);

    // select Delete Space tab
    console.log('click Delete Space tab');
    await page.click('#space-tools-tabs > ul > li:nth-child(2) > a');

    // password
    console.log('Enter password');

    await page.waitFor(1000);
    await  page.keyboard.type(USER.password);

    // confirm password
    console.log('confirmr password');
    await page.click('#authenticateButton');



/**
 * username = await page.evaluate(() => {
    return document.querySelector('#username').value;
  });
  console.log(username);

 */

    await page.waitFor(1000);

    // click on OK
    console.log('click on OK');
    await page.click('#confirm');

    console.log('space removed');

  } else {
    console.log('space created');
  }

  // #create-dialog > div:nth-child(2) > div.dialog-page-body.create-dialog-commonPage > div > div > div.dialog-wizard-page-main > form > fieldset:nth-child(1) > div:nth-child(2) > div
  // console.log('***textContent', textContent);
  // console.log('***textContent', textContent[0]);
  // console.log('***textContent', textContent[1]);

  // const innerText = await page.evaluate(() => page.querySelector('.error'));
  // console.log('***innerText', innerText);

  // const kk = await page.evaluate(() => document.getElementsByClassName('common-space-form'));
  // console.log('***kk', kk);

  // const kkwrapper = await page.evaluate(() => page.querySelector('.dialog-wizard-page-wrapper'));
  // console.log('***kkwrapper', kkwrapper);

  // const innerHTML = await page.evaluate(() => document.getElementsByClassName('error'));
  // console.log('***innerHTML', innerHTML);

  // const errorInnerHTML = await page.evaluate(() => document.querySelectorAll('div.error'));
  // console.log('***errorInnerHTML', errorInnerHTML);

  // const templateName = await page.evaluate(() => document.querySelector('div.template-name').innerText);
  // console.log('***templateName', templateName);

  // const h3Text = await page.evaluate(() => document.querySelector('h3').innerText);
  // console.log('***h3Text', h3Text);

  // const pageDescriptionText = await page.evaluate(() => document.querySelector('.dialog-wizard-page-description').innerHTML);
  // console.log('***pageDescriptionText', pageDescriptionText);
  
  // const descriptorText = await page.evaluate(() => document.querySelector('#create-dialog > div:nth-child(2) > div.dialog-page-body.create-dialog-commonPage > div > div > div.dialog-wizard-page-main > form > fieldset:nth-child(1) > div:nth-child(2) > div'));
  // console.log('***descriptorText', descriptorText);


  // const labelText = await page.evaluate(() => document.querySelector('#create-dialog > div:nth-child(2) > div.dialog-page-body.create-dialog-commonPage > div > div > div.dialog-wizard-page-main > form > fieldset.group > div > label'));
  // console.log('*** labelText', labelText);

  // console.log( await page.$$('#create-dialog > div:nth-child(2) > div.dialog-page-body.create-dialog-commonPage > div > div > div.dialog-wizard-page-main > form > fieldset:nth-child(1) > div:nth-child(2) > div'));
  

  // const searchValue = await page.$eval('.class', el => el.value);
  // console.log('new1', searchValue );


  // await page.waitFor(3000);


  /*
  // close dialog
  await page.click('#create-dialog > div:nth-child(2) > div.dialog-button-panel > a');

  await page.waitFor(3000);

  console.log('before second click on spaces');
 // click on spaces
 await page.click('#space-menu-link');


 console.log('before click on space1');
 // click on space1
// await page.click('#recent-spaces-section > ul > li:nth-child(5) > a > img');

// use page.select
// await page.select('#space-menu-link', 'space1');

// use elementHandle.type
const selectElem = await page.$('#space-menu-link');
await selectElem.select('space1');

 //  const space1entry = await page.evaluate(() => document.querySelector('img.icon, img.space-logo'));
//  const space1entry = await page.evaluate(() => document.querySelector('a.aui-container > img'));

 const space1entry = await page.evaluate(() => document.querySelector('a.aui-container'));


 console.log('*** space1entry', space1entry);

  */

  // const errotText = page.$('#create-dialog > div:nth-child(2) > div.dialog-page-body.create-dialog-commonPage > div > div > div.dialog-wizard-page-main > form > fieldset:nth-child(1) > div:nth-child(2) > div');
  // const errotText = popup.html();

//  const textContent = await page.evaluate(() => document.body.querySelector('.error').textContent);

  // const textContent = await page.waitForFunction(page.querySelector(".count").innerText);
  // console.log('textContent', textContent);

  // test ("A space with this space key already exists", async () => {
  // const center = await page.$eval('#create-dialog > div:nth-child(2) > div.dialog-page-body.create-dialog-commonPage > div > div > div.dialog-wizard-page-main > form > fieldset:nth-child(1) > div:nth-child(2) > div', e => e.innerHTML);
  // expect().toBe("A space with this space key already exists");
  // });

  // var link = await page.$x("//a[contains(text(), 'A space with this space key already exists.')]");
  // console.log('LINK', link[0]);

  // const link = await page.$$eval('div', div => div
  //   .filter(div => div.textContent === 'A space with this space key already exists.'));
  // console.log('LINK', link);

// console.log('before check for A sapace with this space key already exists');

// let selector = 'div';
//     await page.$$eval(selector, anchors => {
//       console.log('here1');
//         anchors.map(anchor => {
//             // if(anchor.textContent == 'A space with this space key already exist') {
//               if(page.querySelector('.error') && anchor.textContent == 'A space with this space key already exist') {

//               console.log('LINK', link);
//             }
//           })
//         });





  // function extractItems() {
  //   const extractedElements = document.querySelectorAll('.error');
  //   const items = [];
  //   for (let element of extractedElements) {
  //     items.push(element.innerText);
  //   }
  //   return items;
  // }
  
  // let items = await page.evaluate(extractItems);
  // const thisspace = page.$('#create-dialog > div:nth-child(2) > div.dialog-page-body.create-dialog-commonPage > div > div > div.dialog-wizard-page-main > form > fieldset:nth-child(1) > div:nth-child(2) > div');
  // //const text = page.evaluate(() => document.querySelector('.error').textContent);'));
  // console.log('thisspace', thisspace);



  // var text = "Blank space";

  //var search = page.$( "Blank space" ); 
//console.log(search);

//const pagina = page.$("template selected");
  // let my_button = await page.$eval(".elements > div", btn => btn.textContent);
 // if(my_button == "Blank space") {
  //  await page.click(".elements > button");
//  }

  // wait for page 
  await page.waitFor(4000);



  // click on spaces
  console.log('Click on Spaces');
  await page.click('#space-menu-link');
  await page.waitFor(2000);


  // click on create space
  console.log('Click on Create Space');
  await page.click('#view-all-spaces-link');

console.log('exit');
} 

async function run() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setViewport({width: 1200, height: 900});
    await page.goto('localhost:8090');

    // browser.on('targetcreated', async (target) => {
    //   console.log(`++++++Created target type ${target.type()}`);
    // });
    
    await LOGIN(page, browser);
  }

run();
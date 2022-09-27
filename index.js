const puppeteer = require("puppeteer-extra");
const { username, password } = require("./config");

require('puppeteer-extra-plugin-user-data-dir');
require('puppeteer-extra-plugin-user-preferences');


require('puppeteer-extra-plugin-stealth/evasions/chrome.app');
require('puppeteer-extra-plugin-stealth/evasions/chrome.csi');
require('puppeteer-extra-plugin-stealth/evasions/chrome.loadTimes');
require('puppeteer-extra-plugin-stealth/evasions/chrome.runtime');
require('puppeteer-extra-plugin-stealth/evasions/defaultArgs');
require('puppeteer-extra-plugin-stealth/evasions/iframe.contentWindow');
require('puppeteer-extra-plugin-stealth/evasions/media.codecs');
require('puppeteer-extra-plugin-stealth/evasions/navigator.hardwareConcurrency');
require('puppeteer-extra-plugin-stealth/evasions/navigator.languages');
require('puppeteer-extra-plugin-stealth/evasions/navigator.permissions');
require('puppeteer-extra-plugin-stealth/evasions/navigator.plugins');
require('puppeteer-extra-plugin-stealth/evasions/navigator.vendor');
require('puppeteer-extra-plugin-stealth/evasions/navigator.webdriver');
require('puppeteer-extra-plugin-stealth/evasions/sourceurl');
require('puppeteer-extra-plugin-stealth/evasions/user-agent-override');
require('puppeteer-extra-plugin-stealth/evasions/webgl.vendor');
require('puppeteer-extra-plugin-stealth/evasions/window.outerdimensions');

const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());
 
let iteration = async () => {

  console.log("Let's check")
 
    let browser = await puppeteer.launch({headless:true});
    let page = await browser.newPage();
 
    await page.goto("https://webparent.paiementdp.com/aliAuthentification.php?site=aes00674");
    let navPromise = page.waitForNavigation({ waitUntil: "networkidle0" });
    await page.type("#txtLogin", username);
    await page.type("#txtMdp", password);
    navPromise = page.waitForNavigation({ waitUntil: "networkidle0" });

    await page.$eval(".bandeauHaut > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(2) > input:nth-child(1)", btn => btn.click());
    navPromise = page.waitForNavigation({ waitUntil: "networkidle0" });
    await page.$eval("tr.index:nth-child(4) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > a:nth-child(1)", btn => btn.click());
    navPromise = page.waitForNavigation({ waitUntil: "networkidle0" });
    await page.waitForSelector("table > tbody > tr > td > a")

    let result1 = await page.evaluate(() => {
      const elements = document.querySelectorAll(".page > table:nth-child(9) > tbody:nth-child(1) > tr:nth-child(1) > td > table:nth-child(2) > tbody:nth-child(1) > tr > td > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > a:nth-child(1)");
      return Array.from(elements).map(element => element.href);
    });
    result1 = result1.filter(elt => elt.indexOf("aliReservationDetail.php") > -1)

    let result2 = await page.evaluate(() => {
      const elements = document.querySelectorAll(".page > table:nth-child(12) > tbody:nth-child(1) > tr:nth-child(1) > td > table:nth-child(2) > tbody:nth-child(1) > tr > td > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > a:nth-child(1)");
      return Array.from(elements).map(element => element.href);
    });
    result2 = result2.filter(elt => elt.indexOf("aliReservationDetail.php") > -1)

    let result = result1.concat(result2);
    console.log(result);

    for (let repas of result) {
      console.log(repas)
      await page.goto(repas);
      let navPromise = page.waitForNavigation({ waitUntil: "networkidle0" });
      console.log("roh")
      await page.waitForSelector("#btnOK")
      console.log('btnOK')
      await page.$eval("#btnOK", btn => btn.click());
      await navPromise
    }

    await browser.close()
};

setInterval(iteration, 1800000)
import puppeteer from 'puppeteer';
import { USER_LIST_SELECTOR } from '../data/selectors.json';
import { BASE_URL, USER_LIST_URL } from '../data/constants.json';
import { expect } from 'chai';

describe('Request Validation', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;
  let interceptedRequest: puppeteer.HTTPRequest;

  before(async function () {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setCacheEnabled(false);
    await page.goto(BASE_URL);
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (request.url() === USER_LIST_URL) {
        interceptedRequest = request;
      }
      request.continue();
    });

    await Promise.all([
      page.click(USER_LIST_SELECTOR),
      page.waitForResponse((response) => response.url() === USER_LIST_URL),
    ]);
  });

  describe('Request verification', () => {
    it('should be a GET method', () => {
      return expect(interceptedRequest.method()).to.equal('GET');
    });
    it('should have the correct URL', () => {
      return expect(interceptedRequest.url()).to.equal(USER_LIST_URL);
    });
  });

  after(async () => {
    await browser.close();
  });
});

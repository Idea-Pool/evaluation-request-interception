import puppeteer, { HTTPResponse } from 'puppeteer';
import { USER_LIST_SELECTOR, OUTPUT_RESPONSE } from '../data/selectors.json';
import { BASE_URL, USER_LIST_URL } from '../data/constants.json';
import { expect } from 'chai';
import { resolve } from 'path';

describe('Request Blocking', () => {
  describe('Blocking the request', () => {
    let browser: puppeteer.Browser;
    let page: puppeteer.Page;
    let errorText: string;

    before(async () => {
      browser = await puppeteer.launch();
      page = await browser.newPage();
      await page.setCacheEnabled(false);
      await page.goto(BASE_URL);
      await page.setRequestInterception(true);

      page.on('request', (request) => {
        if (request.url() === USER_LIST_URL) {
          request.abort();
        } else {
          request.continue();
        }
      });

      page.on('requestfailed', (request) => {
        if (request.url() === USER_LIST_URL) {
          ({ errorText } = request.failure());
        }
      });

      await page.click(USER_LIST_SELECTOR);
      
      await new Promise<void>((res, rej) => {
        setInterval(() => {
          if (errorText) {
            return res();
          }
        });
        setTimeout(rej, 15000, new Error('Timeout'));
      });
    });

    it('the request should fail', () => {
      expect(errorText).to.equal('net::ERR_FAILED');
    });

    it("should not let the response text box appear in the UI's response section", async () => {
      const displayedResponseElement = await page.$(OUTPUT_RESPONSE);

      return expect(await displayedResponseElement.isIntersectingViewport()).to.be.false;
    });

    after(async () => {
      await browser.close();
    });
  });
});

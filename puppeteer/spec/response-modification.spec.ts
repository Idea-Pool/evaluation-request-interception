import puppeteer from 'puppeteer';
import { OUTPUT_RESPONSE, USER_LIST_SELECTOR } from '../data/selectors.json';
import { BASE_URL, USER_LIST_URL } from '../data/constants.json';
import * as mockResponseSchema from '../schemas/mock.json';
import { mockResponse } from '../data/response.json';
import { expect } from 'chai';

describe('Response Modification', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;
  let interceptedRequest: puppeteer.HTTPRequest;
  let displayedResponse: object;

  before(async () => {
    browser = await puppeteer.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(BASE_URL);
    await page.setRequestInterception(true);
  });

  describe('Modified response verification', () => {
    it('the status code should not be 200', async () => {
      page.on('request', (request) => {
        if (request.url() === USER_LIST_URL) {
          interceptedRequest = request;
          request.respond({ status: mockResponse.status });
        }
        request.continue();
      });

      await Promise.all([
        page.click(USER_LIST_SELECTOR),
        page.waitForResponse((response) => response.url() === USER_LIST_URL),
      ]);

      return expect(interceptedRequest.response().status()).to.be.equal(mockResponse.status);
    });

    describe('The modified response body', () => {
      beforeEach(async () => {
        page.on('request', (request) => {
          if (request.url() === USER_LIST_URL) {
            interceptedRequest = request;
            request.respond({ body: JSON.stringify(mockResponse.body) });
          }
          request.continue();
        });

        await Promise.all([
          page.click(USER_LIST_SELECTOR),
          page.waitForResponse((response) => response.url() === USER_LIST_URL),
        ]);
      });

      it('should match exactly', async () => {
        return expect(interceptedRequest.response().json()).to.eventually.be.deep.equal(mockResponse.body);
      });

      it('should match partially', async () =>
        expect(await interceptedRequest.response().json()).to.containSubset({
          id: mockResponse.body.id,
        }));

      it('should match the schema', async () =>
        expect(await interceptedRequest.response().json()).to.be.jsonSchema(mockResponseSchema));

      it('should appear on the UI', async () => {
        displayedResponse = await page.evaluate(() => {
          const element = document.querySelector(OUTPUT_RESPONSE);
          return JSON.parse(element.textContent);
        });

        expect(displayedResponse).to.be.deep.equal(mockResponse.body);
      });
    });
  });

  afterEach(async () => {
    await page.close();
  });

  after(async () => {
    await browser.close();
  });
});

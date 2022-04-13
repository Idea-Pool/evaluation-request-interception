const puppeteer = require('puppeteer');
const browserOptions = require('../browser-options');
const userListSelector = "[data-id='users']";
const { BASE_URL, USER_LIST_PATH } = require('../data/constants.json');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiDeepMatch = require('chai-deep-match');
const expect = chai.expect;
const expectedResponse = require('../data/response.json');
const expectedSchema = require('../data/json-schema.json');
const { mockResponse } = require('../data/response.json');
chai.use(chaiAsPromised);
chai.use(chaiDeepMatch);
chai.use(require('chai-json-schema'));
let browser, page, interceptedRequest;

describe('Response Modification', () => {
  before(async function () {
    browser = await puppeteer.launch(browserOptions);
  });
  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(BASE_URL);
    await page.setRequestInterception(true);
    
  });
  describe('Modified response verification', () => {
    it('the status code should not be 200', async () => {
      page.on('request', request => {
        if (request.url() === `${BASE_URL}${USER_LIST_PATH}`) {
          interceptedRequest = request;
          request.respond({ status: mockResponse.status });
        }
        request.continue();
      });
      page.click(userListSelector);
      await page.waitForResponse(
        response => response.url() === `${BASE_URL}${USER_LIST_PATH}`
      );
      return expect(interceptedRequest.response().status()).to.be.equal(
        mockResponse.status
      );
    });
    describe('The modified response body', () => {
      it('should match exactly', async () => {
        page.on('request', request => {
          if (request.url() === `${BASE_URL}${USER_LIST_PATH}`) {
            interceptedRequest = request;
            request.respond({ body: JSON.stringify(mockResponse.body) });
          }
          request.continue();
        });
        page.click(userListSelector);
        await page.waitForResponse(
          response => response.url() === `${BASE_URL}${USER_LIST_PATH}`
        );
        return expect(
          interceptedRequest.response().json()
        ).to.eventually.be.deep.equal(mockResponse.body);
      });
      it('should match partially', () => {});
      it('should match the schema', () => {});
    });
  });
  afterEach(async () => {
   await page.close();
  });
});

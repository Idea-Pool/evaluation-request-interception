const puppeteer = require('puppeteer');
const userListSelector = "[data-id='users']";
const {
  BASE_URL,
  USER_LIST_PATH,
  SINGLE_USER_PATH,
} = require('../data/constants.json');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiDeepMatch = require('chai-deep-match');
const expect = chai.expect;
const expectedResponse = require('../data/response.json');
chai.use(chaiAsPromised);
chai.use(chaiDeepMatch);
chai.use(require('chai-json-schema'));
let browser, page, interceptedRequest;

describe('Request Modification', () => {
  before(async function () {
    browser = await puppeteer.launch();
  });
  beforeEach(async () => {
    page = await browser.newPage();
    await page.setCacheEnabled(false);
    await page.goto(BASE_URL);
    await page.setRequestInterception(true);
  });
  describe('Modified request verification', () => {
    it('should be a GET method', async () => {
      page.on('request', request => {
        if (request.url() === `${BASE_URL}${USER_LIST_PATH}`) {
          interceptedRequest = request;
        }
        request.continue();
      });
      page.click(userListSelector);
      await page.waitForResponse(
        response => response.url() === `${BASE_URL}${USER_LIST_PATH}`
      );
      expect(interceptedRequest.method()).to.be.equal('GET');
    });

    it('should have the modified URL', async () => {
      let interceptedRequestId, interceptedRequestPath;
      const cdpSession = await page.target().createCDPSession();
      await cdpSession.send('Network.enable');
      await cdpSession.on('Network.requestWillBeSent', requestInfo => {
        if (requestInfo.request.url === `${BASE_URL}${USER_LIST_PATH}`) {
          interceptedRequestId = requestInfo.requestId;
        }
      });
      await cdpSession.on('Network.requestWillBeSentExtraInfo', requestInfo => {
        if (requestInfo.requestId === interceptedRequestId) {
          interceptedRequestPath = requestInfo.headers[':path'];
        }
      });

      page.on('request', request => {
        if (request.url() === `${BASE_URL}${USER_LIST_PATH}`) {
          interceptedRequest = request;
          request.continue({ url: 'https://reqres.in/api/users/2' });
          return;
        }
        request.continue();
      });
      page.click(userListSelector);
      await page.waitForResponse(
        response => response.url() === `${BASE_URL}${USER_LIST_PATH}`
      );
      expect(interceptedRequest.response().json()).to.be.eventually.deep.equal(
        expectedResponse.singleUserResponseBody
      );
      expect(interceptedRequestPath).to.be.equal(SINGLE_USER_PATH);
      return expect(interceptedRequest.headers().referer).to.be.equal(BASE_URL);
    });

    it('should have an additional property', async () => {
      page.on('request', request => {
        if (request.url() === `${BASE_URL}${USER_LIST_PATH}`) {
          interceptedRequest = request;
          const headers = request.headers();
          headers.Sanyi = 'Sanyi';
          request.continue({ headers });
        }
        request.continue();
      });
      page.click(userListSelector);
      await page.waitForResponse(
        response => response.url() === `${BASE_URL}${USER_LIST_PATH}`
      );
      return expect(interceptedRequest.headers()).to.haveOwnProperty('Sanyi');
    });
  });
  afterEach(async () => {
    await page.close();
  });

  after(async () => {
    await browser.close();
  });
});

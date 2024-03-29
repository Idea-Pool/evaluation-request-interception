import puppeteer from 'puppeteer';
import { USER_LIST_SELECTOR } from '../data/selectors.json';
import * as expectedResponse from '../data/response.json';
import { BASE_URL, SINGLE_USER_PATH, USER_LIST_URL, MODIFIED_HEADER } from '../data/constants.json';
import { expect } from 'chai';

describe('Request Modification', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;
  let interceptedRequest: puppeteer.HTTPRequest;

  before(async () => {
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
      expect(interceptedRequest.method()).to.equal('GET');
    });

    it('should have the modified URL', async () => {
      let interceptedRequestId: string;
      let interceptedRequestPath: string;
      const cdpSession = await page.target().createCDPSession();
      await cdpSession.send('Network.enable');
      await cdpSession.on('Network.requestWillBeSent', (requestInfo) => {
        if (requestInfo.request.url === USER_LIST_URL) {
          interceptedRequestId = requestInfo.requestId;
        }
      });
      await cdpSession.on('Network.requestWillBeSentExtraInfo', (requestInfo) => {
        if (requestInfo.requestId === interceptedRequestId) {
          interceptedRequestPath = requestInfo.headers[':path'];
        }
      });

      page.on('request', (request) => {
        if (request.url() === USER_LIST_URL) {
          interceptedRequest = request;
          request.continue({ url: 'https://reqres.in/api/users/2' });

          return;
        }
        request.continue();
      });

      await Promise.all([
        page.click(USER_LIST_SELECTOR),
        page.waitForResponse((response) => response.url() === USER_LIST_URL),
      ]);

      expect(interceptedRequest.response().json()).to.eventually.deep.equal(expectedResponse.singleUserResponseBody);

      expect(interceptedRequestPath).to.equal(SINGLE_USER_PATH);

      return expect(interceptedRequest.headers().referer).to.equal(BASE_URL);
    });

    it('should have an additional property', async () => {
      page.on('request', (request) => {
        if (request.url() === USER_LIST_URL) {
          interceptedRequest = request;
          const headers = request.headers();
          headers[MODIFIED_HEADER] = MODIFIED_HEADER;
          request.continue({ headers });
        }
        request.continue();
      });

      await Promise.all([
        page.click(USER_LIST_SELECTOR),
        page.waitForResponse((response) => response.url() === USER_LIST_URL),
      ]);

      return expect(interceptedRequest.headers()).to.haveOwnProperty(MODIFIED_HEADER);
    });
  });

  afterEach(async () => {
    await page.close();
  });

  after(async () => {
    await browser.close();
  });
});

import puppeteer from 'puppeteer';
import { USER_LIST_SELECTOR, OUTPUT_RESPONSE } from '../data/selectors.json';
import { BASE_URL, USER_LIST_URL, MAX_RESPONSE_TIME } from '../data/constants.json';
import { StatusCodes } from 'http-status-codes';
import { userListResponseBody, partialUsersBody } from '../data/response.json';
import * as userListSchema from '../schemas/user-list.json';
import { expect } from 'chai';

describe('Response Validation', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;
  const interceptedRequests: puppeteer.HTTPRequest[] = [];
  let performanceData: any;

  before(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(BASE_URL);
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (request.url() === USER_LIST_URL) {
        interceptedRequests.push(request);
      }
      request.continue();
    });

    await Promise.all([
      page.click(USER_LIST_SELECTOR),
      page.waitForResponse((response) => response.url() === USER_LIST_URL),
    ]);

    performanceData = await page.evaluate((name) => performance.getEntriesByName(name)[1].toJSON(), USER_LIST_URL);
  });

  describe('Response verification', () => {
    it('she status code should be 200', () =>
      expect(interceptedRequests[0].response().status()).to.equal(StatusCodes.OK));

    describe('The response body', () => {
      let responseBody;
      before(async () => {
        responseBody = await interceptedRequests[0].response().json();
      });
      it('should match exactly', () => expect(responseBody).to.deep.equal(userListResponseBody));

      it('should match partially', () => expect(responseBody).to.containSubset(partialUsersBody));

      it('should match the schema', () => expect(responseBody).to.be.jsonSchema(userListSchema));
    });
  });

  it('the number of responses should be 1', () => {
    expect(interceptedRequests).to.have.length(1);
  });

  it('the response duration should not be longer than 1s', () => {
    const responseTime = performanceData.responseEnd - performanceData.requestStart;

    return expect(responseTime).to.be.below(MAX_RESPONSE_TIME);
  });

  it('should appear on the UI', async () => {
    const displayedResponseElement = await page.$(OUTPUT_RESPONSE);
    const displayedResponseText = await page.evaluate((element) => element.textContent, displayedResponseElement);

    expect(JSON.parse(displayedResponseText)).to.deep.equal(userListResponseBody);
  });

  after(async () => {
    await browser.close();
  });
});

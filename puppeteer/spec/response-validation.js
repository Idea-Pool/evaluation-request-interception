const puppeteer = require('puppeteer');
const userListSelector = "[data-id='users']";
const { BASE_URL, USER_LIST_PATH} = require('../data/constants.json')
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiDeepMatch = require('chai-deep-match');
const expect = chai.expect;
const { StatusCodes } = require('http-status-codes');
const {userListResponseBody,singleUserResponseBody,maxResponseTime} = require('../data/response.json');
const expectedSchema = require('../data/json-schema.json');
chai.use(chaiAsPromised);
chai.use(chaiDeepMatch);
chai.use(require('chai-json-schema'));
let browser,
  page,
  interceptedRequests = [],
  performanceData;

describe('Response Validation', () => {
  before(async function () {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('https://reqres.in/');
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.url() === `${BASE_URL}${USER_LIST_PATH}`) {
        interceptedRequests.push(request);
      }
      request.continue();
    });
    page.click(userListSelector);
    await page.waitForResponse(response => response.url() === `${BASE_URL}${USER_LIST_PATH}`);
  
    performanceData = await page.evaluate(
      name => performance.getEntriesByName(name)[1].toJSON(),
      `${BASE_URL}${USER_LIST_PATH}`
    );
  });

  describe('Response verification', () => {
    it('she status code should be 200', () =>
      expect(interceptedRequests[0].response().status()).to.be.equal(
        StatusCodes.OK
      ));

    describe('The response body', () => {
      it('should match exactly', () =>
        expect(
          interceptedRequests[0].response().json()
        ).to.be.eventually.deep.equal(userListResponseBody));

      it('should match partially', () =>
        expect(
          interceptedRequests[0].response().json()
        ).to.be.eventually.deep.match(singleUserResponseBody.data));

      it('should match the schema', async () =>
        expect(await interceptedRequests[0].response().json()).to.be.jsonSchema(
          expectedSchema
        ));
    });
  });

  it('the number of responses should be 1', () => {
    expect(interceptedRequests).to.have.length(1);
  });

  it('the response duration should not be longer than 1s', () => {
    const responseTime =
      performanceData.responseEnd - performanceData.requestStart;
    return expect(responseTime).to.be.below(maxResponseTime);
  });

  after(async () => {
    await browser.close();
  });
});

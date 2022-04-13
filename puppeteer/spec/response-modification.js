const puppeteer = require("puppeteer");
const userListSelector = "[data-id='users']";
const { BASE_URL, USER_LIST_PATH } = require("../data/constants.json");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const chaiDeepMatch = require("chai-deep-match");
const expect = chai.expect;
const mockResponseSchema = require("../schemas/mock.json");
const { mockResponse } = require("../data/response.json");
chai.use(chaiAsPromised);
chai.use(chaiDeepMatch);
chai.use(require("chai-json-schema"));

describe("Response Modification", () => {
  let browser, page, interceptedRequest;
  before(async function () {
    browser = await puppeteer.launch();
  });
  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(BASE_URL);
    await page.setRequestInterception(true);
  });
  describe("Modified response verification", () => {
    it("the status code should not be 200", async () => {
      page.on("request", (request) => {
        if (request.url() === `${BASE_URL}${USER_LIST_PATH}`) {
          interceptedRequest = request;
          request.respond({ status: mockResponse.status });
        }
        request.continue();
      });
      page.click(userListSelector);
      await page.waitForResponse(
        (response) => response.url() === `${BASE_URL}${USER_LIST_PATH}`
      );
      return expect(interceptedRequest.response().status()).to.be.equal(
        mockResponse.status
      );
    });
    describe("The modified response body", () => {
      it("should match exactly", async () => {
        page.on("request", (request) => {
          if (request.url() === `${BASE_URL}${USER_LIST_PATH}`) {
            interceptedRequest = request;
            request.respond({ body: JSON.stringify(mockResponse.body) });
          }
          request.continue();
        });
        page.click(userListSelector);
        await page.waitForResponse(
          (response) => response.url() === `${BASE_URL}${USER_LIST_PATH}`
        );
        return expect(
          interceptedRequest.response().json()
        ).to.eventually.be.deep.equal(mockResponse.body);
      });
      it("should match partially", () =>
        expect(interceptedRequest.response().json()).to.eventually.deep.match(
          mockResponse.body.id
        ));

      it("should match the schema", async () =>
        expect(await interceptedRequest.response().json()).to.be.jsonSchema(
          mockResponseSchema
        ));
    });
  });
  afterEach(async () => {
    await page.close();
  });
  after(async () => {
    await browser.close();
  });
});

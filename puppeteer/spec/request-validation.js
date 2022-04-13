const puppeteer = require("puppeteer");

const userListSelector = "[data-id='users']";
const { BASE_URL, USER_LIST_PATH } = require("../data/constants.json");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const chaiDeepMatch = require("chai-deep-match");
const expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(chaiDeepMatch);
chai.use(require("chai-json-schema"));

describe("Request Validation", () => {
  let browser, page, interceptedRequest;
  before(async function () {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setCacheEnabled(false);
    await page.goto(BASE_URL);
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (request.url() === `${BASE_URL}${USER_LIST_PATH}`) {
        interceptedRequest = request;
      }
      request.continue();
    });
    page.click(userListSelector);
    await page.waitForResponse(
      (response) => response.url() === `${BASE_URL}${USER_LIST_PATH}`
    );
  });
  describe("Request verification", () => {
    it("should be a GET method", () => {
      return expect(interceptedRequest.method()).to.equal("GET");
    });
    it("should have the correct URL", () => {
      return expect(interceptedRequest.url()).to.equal(
        `${BASE_URL}${USER_LIST_PATH}`
      );
    });
  });

  after(async () => {
    await browser.close();
  });
});

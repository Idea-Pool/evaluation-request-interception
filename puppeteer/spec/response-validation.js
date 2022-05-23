const puppeteer = require("puppeteer");
const {USER_LIST_SELECTOR} = require("../data/selectors.json");
const { BASE_URL,USER_LIST_URL } = require("../data/constants.json");
const { StatusCodes } = require("http-status-codes");
const {
  userListResponseBody,
  singleUserResponseBody,
  maxResponseTime,
} = require("../data/response.json");
const expectedSchema = require("../data/json-schema.json");

describe("Response Validation", () => {
  
  let browser,
    page,
    interceptedRequests = [],
    performanceData;

  before(async function () {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(BASE_URL);
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (request.url() === USER_LIST_URL) {
        interceptedRequests.push(request);
      }
      request.continue();
    });
    page.click(USER_LIST_SELECTOR);
    await page.waitForResponse(
      (response) => response.url() === USER_LIST_URL
    );

    performanceData = await page.evaluate(
      (name) => performance.getEntriesByName(name)[1].toJSON(),
      USER_LIST_URL
    );
  });

  describe("Response verification", () => {
    it("she status code should be 200", () =>
      expect(interceptedRequests[0].response().status()).to.be.equal(
        StatusCodes.OK
      ));

    describe("The response body", () => {
      it("should match exactly", () =>
        expect(
          interceptedRequests[0].response().json()
        ).to.be.eventually.deep.equal(userListResponseBody));

      it("should match partially", () =>
        expect(
          interceptedRequests[0].response().json()
        ).to.eventually.deep.match(singleUserResponseBody.data));

      it("should match the schema", async () =>
        expect(await interceptedRequests[0].response().json()).to.be.jsonSchema(
          expectedSchema
        ));
    });
  });

  it("the number of responses should be 1", () => {
    expect(interceptedRequests).to.have.length(1);
  });

  it("the response duration should not be longer than 1s", () => {
    const responseTime =
      performanceData.responseEnd - performanceData.requestStart;
    return expect(responseTime).to.be.below(maxResponseTime);
  });

  after(async () => {
    await browser.close();
  });
});

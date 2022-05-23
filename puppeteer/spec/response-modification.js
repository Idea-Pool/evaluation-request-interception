const puppeteer = require("puppeteer");
const {USER_LIST_SELECTOR} = require("../data/selectors.json");
const { BASE_URL,USER_LIST_URL } = require("../data/constants.json");
const mockResponseSchema = require("../schemas/mock.json");
const { mockResponse } = require("../data/response.json");

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
        if (request.url() === USER_LIST_URL) {
          interceptedRequest = request;
          request.respond({ status: mockResponse.status });
        }
        request.continue();
      });
      page.click(USER_LIST_SELECTOR);
      await page.waitForResponse(
        (response) => response.url() === USER_LIST_URL
      );
      return expect(interceptedRequest.response().status()).to.be.equal(
        mockResponse.status
      );
    });

    describe("The modified response body", () => {
      it("should match exactly", async () => {
        page.on("request", (request) => {
          if (request.url() === USER_LIST_URL) {
            interceptedRequest = request;
            request.respond({ body: JSON.stringify(mockResponse.body) });
          }
          request.continue();
        });
        page.click(USER_LIST_SELECTOR);
        await page.waitForResponse(
          (response) => response.url() === USER_LIST_URL
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

const puppeteer = require("puppeteer");
const {USER_LIST_SELECTOR} = require("../data/selectors.json");
const { BASE_URL,USER_LIST_URL} = require("../data/constants.json");



describe("Request Validation", () => {
  let browser, page, interceptedRequest;

  before(async function () {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setCacheEnabled(false);
    await page.goto(BASE_URL);
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (request.url() === USER_LIST_URL) {
        interceptedRequest = request;
      }
      request.continue();
    });
    page.click(USER_LIST_SELECTOR);
    await page.waitForResponse(
      (response) => response.url() === USER_LIST_URL
    );
  });
  
  describe("Request verification", () => {
    it("should be a GET method", () => {
      return expect(interceptedRequest.method()).to.equal("GET");
    });
    it("should have the correct URL", () => {
      return expect(interceptedRequest.url()).to.equal(
        USER_LIST_URL
      );
    });
  });

  after(async () => {
    await browser.close();
  });
});

 
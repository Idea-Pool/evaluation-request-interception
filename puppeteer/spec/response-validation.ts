import * as puppeteer from "puppeteer";
import { USER_LIST_SELECTOR } from "../data/selectors.json";
import {
  BASE_URL,
  USER_LIST_URL,
  MAX_RESPONSE_TIME,
} from "../data/constants.json";
import { StatusCodes } from "http-status-codes";
import {
  userListResponseBody,
  singleUserResponseBody,
} from "../data/response.json";
import * as userListSchema from "../schemas/user-list.json";

describe("Response Validation", () => {
  let browser: puppeteer.Browser,
    page: puppeteer.Page,
    interceptedRequests: puppeteer.HTTPRequest[] = [],
    performanceData: any;

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

    await Promise.all([
      page.click(USER_LIST_SELECTOR),
      page.waitForResponse((response) => response.url() === USER_LIST_URL),
    ]);

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

      it("should match partially", async () =>
        expect(await interceptedRequests[0].response().json()).to.containSubset(
          singleUserResponseBody.data
        ));

      it("should match the schema", async () =>
        expect(await interceptedRequests[0].response().json()).to.be.jsonSchema(
          userListSchema
        ));
    });
  });

  it("the number of responses should be 1", () => {
    expect(interceptedRequests).to.have.length(1);
  });

  it("the response duration should not be longer than 1s", () => {
    const responseTime =
      performanceData.responseEnd - performanceData.requestStart;
    return expect(responseTime).to.be.below(MAX_RESPONSE_TIME);
  });

  after(async () => {
    await browser.close();
  });
});

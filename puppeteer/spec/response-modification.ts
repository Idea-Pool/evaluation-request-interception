import * as puppeteer from "puppeteer";
import { USER_LIST_SELECTOR } from "../data/selectors.json";
import { BASE_URL, USER_LIST_URL } from "../data/constants.json";
import * as mockResponseSchema  from "../schemas/mock.json";
import { mockResponse } from "../data/response.json";

describe("Response Modification", () => {
  let browser:puppeteer.Browser, page:puppeteer.Page, interceptedRequest:puppeteer.HTTPRequest;

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

      it("should match partially", async () =>
        expect(await interceptedRequest.response().json()).to.containSubset(
          {id:mockResponse.body.id}
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

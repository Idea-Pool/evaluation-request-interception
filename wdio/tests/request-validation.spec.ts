import { expect } from 'chai';
import WdioInterceptorService from 'wdio-intercept-service';
import { expectedRequestMethod, expectedResponseStatusCode, expectedURL, usersSelector } from '../data/test-data.json';

describe('Request validation', () => {
  before(async () => {
    await browser.url('/');
  });

  describe('Request verification', () => {
    let request: AsyncSync<WdioInterceptorService.CompletedRequest>;

    before(async () => {
      const getUsers = $(`${usersSelector}`);
      browser.setupInterceptor();
      await getUsers.click();
      request = await browser.getRequest(0);
    });

    it('should return only the required one request', async () => {
      await browser.expectRequest(
        <WdioInterceptorService.HTTPMethod>expectedRequestMethod,
        expectedURL,
        expectedResponseStatusCode,
      );
      await browser.assertExpectedRequestsOnly();
    });

    it('should be a GET method', () => {
      expect(request.method).to.equal(expectedRequestMethod);
    });

    it('should match the URL', () => {
      expect(request.url).to.contain(expectedURL);
    });
  });
});

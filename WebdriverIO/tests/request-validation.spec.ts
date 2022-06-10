import { expect } from 'chai';
import { expectedRequestMethod, expectedResponseStatusCode, expectedURL, usersSelector } from './test-data.json';
import WdioInterceptorService from 'wdio-intercept-service';

describe('Request validation', async () => {
  before(async () => {
    await browser.url('/');
  });

  describe('Request verification', async () => {
    before(async () => {
      const getUsers = $('[data-id="users"]');
      await browser.setupInterceptor();
      await getUsers.click();
    });

    it('should return only the required one request', async () => {
      await browser.expectRequest(
        <WdioInterceptorService.HTTPMethod>expectedRequestMethod,
        expectedURL,
        expectedResponseStatusCode,
      );
      await browser.assertExpectedRequestsOnly();
    });

    it('should be a GET method', async () => {
      const request = await browser.getRequest(0);
      expect(request.method).to.equal('GET');
    });

    it.skip('should match the URL', async () => {
      const request = await browser.getRequest(0);
      expect(request.url).to.contain('/api/users?page=2');
    });
  });
});


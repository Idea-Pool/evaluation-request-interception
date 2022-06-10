import { multipleUsersSchema } from './list-users-schema';
import { validate, ValidatorResult } from 'jsonschema';
import { expect } from 'chai';
import { expectedRequestMethod, expectedResponseStatusCode, expectedURL, usersSelector } from './test-data.json';
import WdioInterceptorService from 'wdio-intercept-service';
import * as users from '../data/users.json';

describe('Response validation', () => {
  const MAX_RESPONSE_TIME = 1000;

  before(async () => {
    await browser.url('/');
  });

  describe('Response verification', () => {
    let getUsers;
    let request;

    before(async () => {
      getUsers = $(`${usersSelector}`);
      browser.setupInterceptor();
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

    it('should return 200 status code', async () => {
      request = await browser.getRequest(0);
      expect(request.response.statusCode).to.equal(expectedResponseStatusCode);
    });

    describe('The response body', () => {
      it('should return the appropriate full body schema', async () => {
        request = await browser.getRequest(0);
        const validation: ValidatorResult = validate(request.response.body, multipleUsersSchema);
        expect(validation.valid).to.equal(true);
      });

      it('should fully match the original response', async () => {
        request = await browser.getRequest(0);
        expect(request.response.body).to.deep.equal(users.originalFullUsersBody);
      });

      it('should partially match the original response', async () => {
        request = await browser.getRequest(0);
        expect(request.response.body).to.deep.contain(users.originalPartialUsersBody);
      });
    });
  });

  it('should return the response under 1 second', async () => {
    const getUsers = $(`${usersSelector}`);
    browser.setupInterceptor();

    const startTime = new Date().getTime();
    await getUsers.click();
    await browser.expectRequest(
      <WdioInterceptorService.HTTPMethod>expectedRequestMethod,
      expectedURL,
      expectedResponseStatusCode,
    );
    await browser.assertExpectedRequestsOnly();
    await browser.getRequest(0);
    const endTime = new Date().getTime();
    expect(endTime - startTime).to.be.lessThan(MAX_RESPONSE_TIME);
  });
});

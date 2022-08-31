import { expect } from 'chai';
import WdioInterceptorService from 'wdio-intercept-service';
import { validate, ValidatorResult } from 'jsonschema';

import {
  expectedRequestMethod,
  expectedResponseStatusCode,
  expectedURL,
  usersSelector,
  usersResponseSelector,
} from '../data/test-data.json';
import * as users from '../data/users.json';
import { multipleUsersSchema } from '../data/list-users-schema';

describe('Response validation', () => {
  const MAX_RESPONSE_TIME = 5000;

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

    it('should return 200 status code', () => {
      expect(request.response.statusCode).to.equal(expectedResponseStatusCode);
    });

    describe('The response body', () => {
      it('should return the appropriate full body schema', () => {
        const validation: ValidatorResult = validate(request.response.body, multipleUsersSchema);
        expect(validation.valid).to.equal(true);
      });

      it('should fully match the original response', () => {
        expect(request.response.body).to.deep.equal(users.originalFullUsersBody);
      });

      it('should partially match the original response', () => {
        expect(request.response.body).to.deep.contain(users.originalPartialUsersBody);
      });

      it('should appear on the UI', async () => {
        const usersResponse = JSON.parse(await $(`${usersResponseSelector}`).getText());
        expect(usersResponse).to.deep.equal(users.originalFullUsersBody);
      });
    });
  });

  it('should return the response under a few seconds', async () => {
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

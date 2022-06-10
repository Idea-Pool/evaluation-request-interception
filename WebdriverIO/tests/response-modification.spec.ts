import { multipleUsersSchema } from './list-users-schema';
import { validate, ValidatorResult } from 'jsonschema';
import { expect } from 'chai';
import {
  expectedRequestMethod,
  expectedResponseStatusCode,
  expectedURL,
  modifiedResponseStatusCode,
  usersSelector,
} from './test-data.json';
import WdioInterceptorService from 'wdio-intercept-service';
import * as users from '../data/users.json';

describe('Response modification', () => {
  before(async () => {
    await browser.url('/');
  });

  describe('Modified response verification', () => {
    let request;

    before(async () => {
      const getUsers = $(`${usersSelector}`);
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

    it('should return 202 status code after modifying the response', async () => {
      request = await browser.getRequest(0);
      request.response.statusCode = modifiedResponseStatusCode;
      expect(request.response.statusCode).to.equal(modifiedResponseStatusCode);
    });

    describe('The modified response body', () => {
      it('should return the appropriate full body schema', async () => {
        request = await browser.getRequest(0);
        const validation: ValidatorResult = validate(request.response.body, multipleUsersSchema);
        expect(validation.valid).to.equal(true);
      });

      it('should fully match the modified response', async () => {
        request = await browser.getRequest(0);
        request.response.body = users.modifiedFullUsersBody;
        expect(request.response.body).to.deep.equal(users.modifiedFullUsersBody);
      });

      it('should partially match the modified response', async () => {
        request = await browser.getRequest(0);
        request.response.body = users.modifiedFullUsersBody;
        expect(request.response.body).to.deep.contain(users.modifiedPartialUsersBody);
      });
    });
  });
});

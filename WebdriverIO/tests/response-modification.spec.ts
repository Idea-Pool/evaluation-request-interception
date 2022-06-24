import WdioInterceptorService from 'wdio-intercept-service';
import { validate, ValidatorResult } from 'jsonschema';
import { expect } from 'chai';

import {
  expectedRequestMethod,
  expectedURL,
  modifiedResponseStatusCode,
  usersSelector,
} from '../data/test-data.json';
import * as users from '../data/users.json';
import { multipleUsersSchema } from '../data/list-users-schema';

describe('Response modification', () => {
  before(async () => {
    await browser.url('/');
  });

  describe('Modified response verification', () => {
    let request;

    before(async () => {
      const getUsers = $(`${usersSelector}`);
      browser.setupInterceptor();

      const mockResponse = await browser.mock(`**${ expectedURL }`, { method: 'get' });
      mockResponse.respond(users.modifiedFullUsersBody, { statusCode: modifiedResponseStatusCode });
      await getUsers.click();
    });

    it('should return only the required one request', async () => {
      await browser.expectRequest(
        <WdioInterceptorService.HTTPMethod>expectedRequestMethod,
        expectedURL,
        modifiedResponseStatusCode,
      );
      await browser.assertExpectedRequestsOnly();
    });

    it('should return 202 status code after modifying the response', async () => {
      request = await browser.getRequest(0);
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
        expect(request.response.body).to.deep.equal(users.modifiedFullUsersBody);
      });

      it('should partially match the modified response', async () => {
        request = await browser.getRequest(0);
        expect(request.response.body).to.deep.contain(users.modifiedPartialUsersBody);
      });
    });
  });
});

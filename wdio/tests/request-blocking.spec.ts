import { usersResponseSelector, usersSelector, expectedURL } from '../data/test-data.json';
import { expect } from 'chai';

describe('Request Blocking', () => {
  before(async () => {
    await browser.url('/');
  });

  describe('Blocking the request', () => {
    let beforeActionResponse: string;
    let afterActionResponse: string;

    before(async () => {
      const getUsers = $(`${usersSelector}`);
      browser.setupInterceptor();
      await getUsers.click();
      beforeActionResponse = await $(usersResponseSelector).getText();

      const mockResponse = await browser.mock(`**${expectedURL}`, { method: 'get' });
      mockResponse.abort('Aborted');
      await getUsers.click();
      afterActionResponse = await $(usersResponseSelector).getText();
    });

    it("should not let the response text appear in the UI's response section", () => {
      expect(beforeActionResponse).to.be.not.empty;
      expect(afterActionResponse).to.be.empty;
    });
  });
});

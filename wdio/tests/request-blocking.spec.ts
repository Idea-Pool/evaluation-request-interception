import { usersResponseSelector, usersSelector, expectedURL } from '../data/test-data.json';
import { expect } from 'chai';

describe('Request Blocking', () => {
  before(async () => {
    await browser.url('/');
  });

  describe('Blocking the request', () => {
    before(async () => {
      const getUsers = $(`${usersSelector}`);
      browser.setupInterceptor();

      const mockResponse = await browser.mock(`**${expectedURL}`, { method: 'get' });
      mockResponse.abort('Aborted');
      await getUsers.click();
    });

    it("should return no requests", async () => {
      try {
        await browser.getRequest(0);
      } catch (error) {
        expect(error.message).to.equal('Could not find request with index 0');
      }
    });

    it("should not let the response text appear in the UI's response section", async () => {
      const usersResponse = await $(`${usersResponseSelector}`).getText();
      expect(usersResponse).to.be.empty;
    });
  });
});

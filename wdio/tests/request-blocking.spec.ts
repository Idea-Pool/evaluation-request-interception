import { usersResponseSelector, usersSelector, expectedURL } from '../data/test-data.json';
import { expect } from 'chai';
import { Mock } from 'webdriverio/build/types'
import DevtoolsInterception from 'webdriverio/build/utils/interception/devtools';

describe('Request Blocking', () => {
  before(async () => {
    await browser.url('/');
  });

  describe('Blocking the request', () => {
    let mock: Mock;

    before(async () => {
      const getUsers = $(`${usersSelector}`);
      browser.setupInterceptor();
      mock = await browser.mock(`**${expectedURL}`, { method: 'get' });
      mock.abort('Aborted');
      await getUsers.click();
    });

    it("the request should fail", () => {
      const errorReason = (mock as DevtoolsInterception).respondOverwrites[0].errorReason;
      expect(errorReason).to.equal('Aborted');
    });

    it("the UI's response section should not be displayed", async () => {
      const response = await $(usersResponseSelector).getText();
      expect(response).to.be.empty;
    });
  });
});

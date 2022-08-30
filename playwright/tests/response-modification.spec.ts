import { expect, test } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';
import { modifiedBody } from '../data/response-body';
import * as selectors from '../data/selectors.json';

test.describe('response modification', () => {
  let response;
  let responseStatus;
  let responseBody;

  test.beforeEach(async ({ page }) => {
    await page.goto('');

    await page.route('**/users?page=2', (route) =>
      route.fulfill({
        body: JSON.stringify(modifiedBody),
        status: 404,
      }),
    );

    [response] = await Promise.all([page.waitForResponse('**/users?page=2'), page.click(selectors.users)]);
    responseStatus = await response.status();
    responseBody = await response.json();
  });

  test('the status code should not be 200', () => {
    expect(responseStatus).not.toBe(StatusCodes.OK);
  });

  test('should match exactly', () => {
    expect(responseBody).toEqual(modifiedBody);
  });

  test('should appear on the UI', async ({ page }) => {
    const text = await page.locator(selectors.uiUsersResponse).textContent();
    const parsedUITextContent = JSON.parse(text);
    expect(parsedUITextContent).toEqual(modifiedBody);
  });
});

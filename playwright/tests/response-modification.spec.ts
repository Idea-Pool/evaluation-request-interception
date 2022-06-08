import { expect, test } from '@playwright/test';
import { modifiedBody } from '../data/response-body';

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

    [response] = await Promise.all([page.waitForResponse('**/users?page=2'), page.click('[data-id = "users"]')]);
    responseStatus = await response.status();
    responseBody = await response.json();
  });

  test('the status code should not be 200', () => {
    expect(responseStatus).not.toBe(200);
  });

  test('should match exactly', () => {
    expect(responseBody).toEqual(modifiedBody);
  });
});

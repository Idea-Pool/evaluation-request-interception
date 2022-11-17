import * as selectors from '../data/selectors.json';
import { expect, test } from '@playwright/test';

test.describe('Request Blocking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await page.route('**/users?page=2', (route) => route.abort());
    await page.click(selectors.users);
  });

  test('the response text should be visible before the abort', async ({ page }) => {
    const [request] = await Promise.all([page.waitForRequest('**/users?page=2'), page.click(selectors.users)]);
    const { errorText } = request.failure();
    expect(errorText).toEqual('net::ERR_FAILED');
  });

  test('the response text should not be visible after the abort', async ({ page }) => {
    await expect(page.locator(selectors.uiUsersResponse)).not.toBeVisible();
  });
});

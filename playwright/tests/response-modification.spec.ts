import { expect, test } from '@playwright/test';
import { Response } from 'playwright-core';
import { StatusCodes } from 'http-status-codes';
import { modifiedBody } from '../data/response-body';
import * as selectors from '../data/selectors.json';
import { Serializable } from 'worker_threads';

test.describe('response modification', () => {
  let response: Response;

  test.beforeEach(async ({ page }) => {
    await page.goto('');

    await page.route('**/users?page=2', (route) =>
      route.fulfill({
        body: JSON.stringify(modifiedBody),
        status: StatusCodes.NOT_FOUND,
      }),
    );

    [response] = await Promise.all([page.waitForResponse('**/users?page=2'), page.click(selectors.users)]);
  });

  test('the status code should not be 200', () => {
    const responseStatus = response.status();
    expect(responseStatus).not.toBe(StatusCodes.OK);
    expect(responseStatus).toBe(StatusCodes.NOT_FOUND);
  });

  test('should match exactly', async () => {
    const responseBody: Promise<Serializable> = await response.json();
    expect(responseBody).toEqual(modifiedBody);
  });

  test('should appear on the UI', async ({ page }) => {
    const text = await page.locator(selectors.uiUsersResponse).textContent();
    const parsedUITextContent: string = JSON.parse(text);
    expect(parsedUITextContent).toEqual(modifiedBody);
  });
});

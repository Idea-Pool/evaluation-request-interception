import { expect, test } from '@playwright/test';
import * as selectors from '../data/selectors.json';
import {Request} from 'playwright-core';

test.describe('request validation', () => {
  let request: Request;

  test.beforeEach(async ({ page }) => {
    await page.goto('');

    [request] = await Promise.all([page.waitForRequest('**/users?page=2'), page.click(selectors.users)]);
  });

  test('Should be a GET request method for listing users', () => {
    expect(request.method()).toBe('GET');
  });

  test('the request url should be correct', () => {
    expect(request.url()).toEqual('https://reqres.in/api/users?page=2');
  });
});

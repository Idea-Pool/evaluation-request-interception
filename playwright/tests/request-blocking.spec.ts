import * as selectors from '../data/selectors.json';
import { expect, test } from '@playwright/test';

test.describe('Request Blocking', () => {

    test.beforeEach(async ({page}) => {
        await page.goto('');

        await page.route("**/users?page=2", route => route.abort());
        await page.click(selectors.users);
    });

    test("should not let the response text appear in the UI's response section", async ({page}) => {
        await expect(page.locator(selectors.uiUsersResponse)).toBeHidden();
    });
});

import * as selectors from '../data/selectors.json';
import { expect, test } from '@playwright/test';

test.describe('Request Blocking', () => {
    let beforeActionVisibility;
    let afterActionVisibility;

    test.beforeEach(async ({page}) => {
        await page.goto('');
        await page.click(selectors.users);
        beforeActionVisibility = await page.locator(selectors.uiUsersResponse).isVisible();

        await page.route("**/users?page=2", route => route.abort());
        await page.click(selectors.users);
        afterActionVisibility = await page.locator(selectors.uiUsersResponse).isVisible();
    });

    test("should not let the response text appear in the UI's response section", async () => {
        await expect(beforeActionVisibility).toBe(true);
        await expect(afterActionVisibility).toBe(false);
    });
});

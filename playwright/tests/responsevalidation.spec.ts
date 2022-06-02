import {test, expect} from '@playwright/test';
import {partialBody} from '../data/response-body';
import {fullBody} from '../data/users';

test.describe('response validation', async () => {
    let response
    let responseBody

    test.beforeEach(async ({page}) => {
        await page.goto("");

        [response] = await Promise.all([
            page.waitForResponse('**/users?page=2'),
            page.click("[data-id = \"users\"]"),
        ]);
        responseBody = await response.json();
    });

    test('the status code should be 200', () => {
        expect(response.status()).toBe(200);
    });

    test("should match partially", () => {
        expect(responseBody).toEqual(expect.objectContaining(partialBody));
    });

    test("should match exactly", () => {
        expect(responseBody).toEqual(fullBody);
    });

    test("the response duration should not be longer than 1s", async ({page}) => {
        const [request] = await Promise.all([
            page.waitForEvent('requestfinished'),
            page.click("[data-id = \"users\"]"),
        ]);
        const requestStart = request.timing().requestStart;
        const responseEnd = request.timing().responseEnd;
        const totalRunTime = responseEnd - requestStart;
        await expect(totalRunTime).toBeLessThan(1000)
    });

    test('the number of responses should be 1', async ({page}) => {
        let urls = 0
        await page.on('response', response => {
            response.url().includes("users?page=2") ?
                urls += 1 : urls += 0;
        });
        await page.click("[data-id = \"users\"]");
        expect(urls).toEqual(1);
    });
});

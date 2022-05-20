import {expect, test} from '@playwright/test';

test.describe('request validation', () => {
    let request;

    test.beforeEach(async ({page}) => {
        await page.goto("");

        page.click("[data-id = \"users\"]");
        request = await page.waitForRequest(request => request.url().includes('users?page=2'));
    });

    test('Should be a GET request method for listing users', () => {
        expect(request.method()).toBe('GET');
    });

    test('the request url should be correct', () => {
        expect(request.url()).toEqual('https://reqres.in/api/users?page=2');
    });
});

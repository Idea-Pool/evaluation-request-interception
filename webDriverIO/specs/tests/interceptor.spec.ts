import * as assert from "assert";

describe(`Request and Response check`, () => {
    let getUsers;

    describe(`Request validation`, () => {
        before( async () => {
            await browser.url("https://reqres.in/");
            getUsers = $("[data-id=\"users\"]");
        });

        it('should be a GET method', async () => {
            browser.setupInterceptor();
            await getUsers.click();
            const request = await browser.getRequest(0);

            console.warn(`Request method: ${JSON.stringify(request.method)}`);
            assert.equal(request.method, 'GET');
        });
    });

    describe(`Response validation`, () => {
        before( async () => {
            await browser.url("https://reqres.in/");
            getUsers = $("[data-id=\"users\"]");
        });

        it('should return 200 status code', async () => {
            browser.setupInterceptor();

            await getUsers.click();
            const request = await browser.getRequest(0);

            console.warn(`Response status code: ${JSON.stringify(request.response.statusCode)}`);
            assert.equal(request.response.statusCode, 200);
        });
    });
});

import { expect } from 'chai';

describe('Request validation', () => {
    before(async () => {
        await browser.url('https://reqres.in/');
    });

    describe('Request verification', () => {
        before(async () => {
            const getUsers = $('[data-id="users"]');
            browser.setupInterceptor();
            await getUsers.click();
        });

        it('should return only the required one request', async () => {
            await browser.expectRequest('GET', '/api/users?page=2', 200);
            await browser.assertExpectedRequestsOnly();
        });

        it('should be a GET method', async () => {
            const request = await browser.getRequest(0);
            expect(request.method).to.equal('GET');
        });

        it('should match the URL', async () => {
            const request = await browser.getRequest(0);
            expect(request.url).to.contain('/api/users?page=2');
        });
    });
});

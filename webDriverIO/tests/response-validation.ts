import { multipleUsersSchema } from '../data/list-users-schema';
import { validate, ValidatorResult } from 'jsonschema';
const users = require('../data/users.json');
import { expect } from 'chai';

describe('Response validation', () => {
    before(async () => {
        await browser.url('https://reqres.in/');
    });

    describe('Response verification', () => {
        let getUsers;
        let request;

        before(async () => {
            getUsers = $('[data-id="users"]');
            browser.setupInterceptor();
            await getUsers.click();
        });

        it('should return only the required one request', async () => {
            await browser.expectRequest('GET', '/api/users?page=2', 200);
            await browser.assertExpectedRequestsOnly();
        });

        it('should return 200 status code', async () => {
            request = await browser.getRequest(0);
            expect(request.response.statusCode).to.equal(200);
        });

        describe('The response body', () => {
            it('should return the appropriate full body schema', async () => {
                request = await browser.getRequest(0);
                const validation: ValidatorResult = validate(request.response.body, multipleUsersSchema);
                expect(validation.valid).to.equal(true);
            });

            it('should fully match the original response', async () => {
                request = await browser.getRequest(0);
                expect(request.response.body).to.deep.equal(users.originalFullUsersBody);
            });

            it('should partially match the original response', async () => {
                request = await browser.getRequest(0);
                expect(request.response.body).to.deep.contain(users.originalPartialUsersBody);
            });
        });
    });

    it('should return the response under 1 second', async () => {
        const getUsers = $('[data-id="users"]');
        browser.setupInterceptor();

        const startTime = new Date().getTime();
        await getUsers.click();
        await browser.expectRequest('GET', '/api/users?page=2', 200);
        await browser.assertExpectedRequestsOnly();
        await browser.getRequest(0);
        const endTime = new Date().getTime()
        expect(endTime - startTime).to.be.lessThan(1000);
    });
});

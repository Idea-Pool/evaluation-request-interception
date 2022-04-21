import { multipleUsersSchema } from '../data/list-users-schema';
import { validate, ValidatorResult } from 'jsonschema';
const users = require('../data/users.json');
import { expect } from 'chai';

describe('Response modification', () => {
    before(async () => {
        await browser.url('https://reqres.in/');
    });

    describe('Modified response verification', () => {
        let request;

        before(async () => {
            const getUsers = $('[data-id="users"]');
            browser.setupInterceptor();
            await getUsers.click();
        });

        it('should return only the required one request', async () => {
            await browser.expectRequest('GET', '/api/users?page=2', 200);
            await browser.assertExpectedRequestsOnly();
        });

        it('should return 202 status code after modifying the response', async () => {
            request = await browser.getRequest(0);
            request.response.statusCode = 202;
            expect(request.response.statusCode).to.equal(202);
        });

        describe('The modified response body', () => {
            it('should return the appropriate full body schema', async () => {
                const request = await browser.getRequest(0);
                const validation: ValidatorResult = validate(request.response.body, multipleUsersSchema);
                expect(validation.valid).to.equal(true);
            });

            it('should fully match the modified response', async () => {
                request = await browser.getRequest(0);
                request.response.body = users.modifiedFullUsersBody;
                expect(request.response.body).to.deep.equal(users.modifiedFullUsersBody);
            });

            it('should partially match the modified response', async () => {
                request = await browser.getRequest(0);
                request.response.body = users.modifiedFullUsersBody;
                expect(request.response.body).to.deep.contain(users.modifiedPartialUsersBody);
            });
        });
    });
});


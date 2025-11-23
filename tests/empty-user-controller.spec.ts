import {expect, test} from "@playwright/test";
import StatusCodes from "http-status-codes"

let baseURLWithEndpoint: string = 'http://localhost:3000/users';

test.describe('User management API with no users', () => {

    test('all users should return empty array when no users have been created', async ({ request }) => {
        const response = await request.get(`${baseURLWithEndpoint}`);
        expect(response.status()).toBe(StatusCodes.OK);

        const responseBody = await response.text();
        expect(responseBody).toBe('[]');
    });

    test('find user should return 404 if user not found', async ({ request }) => {
        const findUserResponse = await request.get(`${baseURLWithEndpoint}/1`);
        expect(findUserResponse.status()).toBe(StatusCodes.NOT_FOUND);
    });

    test('delete user should return 404 if user not found', async ({ request }) => {
        const deleteUserResponse = await request.get(`${baseURLWithEndpoint}/1`);
        expect(deleteUserResponse.status()).toBe(StatusCodes.NOT_FOUND);
    });
});

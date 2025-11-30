// tests/api.spec.ts
import {test, expect, APIRequestContext} from '@playwright/test';
import {UserDTO} from "./DTO/UserDTO";
import {StatusCodes} from "http-status-codes";

const baseURLWithEndpoint: string = 'http://localhost:3000/users';

test.describe('User management API', () => {

    const prepareEnv = async (request: APIRequestContext): Promise<void> => {
        const responseUsers = await request.get(`${baseURLWithEndpoint}`);
        const users: UserDTO[] = await responseUsers.json();
        for (let i=0; i<users.length; i++) {
            await request.delete(`${baseURLWithEndpoint}/${users[i].id}`);
        }
    };

    test('all users: should return empty array when no users', async ({ request }) => {
        await prepareEnv(request);
        const response = await request.get(`${baseURLWithEndpoint}`);
        expect(response.status()).toBe(StatusCodes.OK);
        const responseBody = await response.text()
        expect(responseBody).toBe('[]');
    });

    test('find user: should return a user by ID', async ({ request }) => {
        await prepareEnv(request);
        const createUserResponse = await request.post(`${baseURLWithEndpoint}`);
        const createUserJson: UserDTO = await createUserResponse.json();
        const findUserResponse = await request.get(`${baseURLWithEndpoint}/${createUserJson.id}`);
        expect(findUserResponse.status()).toBe(StatusCodes.OK);
        const findUserJson: UserDTO = await findUserResponse.json();
        UserDTO.checkServerResponse(findUserJson);
    });

    test('find user: should return 404 if user not found', async ({ request }) => {
        await prepareEnv(request);
        const findUserResponse = await request.get(`${baseURLWithEndpoint}/200`);
        expect(findUserResponse.status()).toBe(StatusCodes.NOT_FOUND);
    });

    test('create user: should add a new user', async ({ request }) => {
        await prepareEnv(request);
        const createUserResponse = await request.post(`${baseURLWithEndpoint}`);
        expect(createUserResponse.status()).toBe(StatusCodes.CREATED);
        const createUserJson: UserDTO = await createUserResponse.json();
        UserDTO.checkServerResponse(createUserJson);
    });

    test('delete user: should delete a user by ID', async ({ request }) => {
        await prepareEnv(request);
        const createUserResponse = await request.post(`${baseURLWithEndpoint}`);
        const createUserJson: UserDTO = await createUserResponse.json();
        const deleteUserResponse = await request.delete(`${baseURLWithEndpoint}/${createUserJson.id}`);
        expect(deleteUserResponse.status()).toBe(StatusCodes.OK);
        const deleteUserJson: UserDTO = await deleteUserResponse.json();
        UserDTO.checkServerResponse(deleteUserJson);
    });

    test('delete user: should return 404 if user not found', async ({ request }) => {
        await prepareEnv(request);
        const deleteUserResponse = await request.delete(`${baseURLWithEndpoint}/200`);
        expect(deleteUserResponse.status()).toBe(StatusCodes.NOT_FOUND);
    });
});

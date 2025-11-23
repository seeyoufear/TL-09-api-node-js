import {test, expect, request, APIRequestContext} from '@playwright/test';
import {UserDTO} from "./DTO/UserDTO";
import {StatusCodes} from "http-status-codes";

let baseURLWithEndpoint: string = 'http://localhost:3000/users';

test.describe('User management API', () => {

    const prepareEnv = async (request: APIRequestContext): Promise<void> => {
        const responseUsers = await request.get(`${baseURLWithEndpoint}`);
        const users: UserDTO[] = await responseUsers.json();
        for (let i=0; i<users.length; i++) {
            await request.delete(`${baseURLWithEndpoint}/${users[i].id}`);
        }
    };

    test('14.1 Проверка возвращения нескольких юзеров', async ({request}) => {
        await prepareEnv(request);
        await UserDTO.createUsers(5, request);
        const responseUsers = await request.get(`${baseURLWithEndpoint}`);
        expect(responseUsers.status()).toBe(StatusCodes.OK);
        const responseBody: UserDTO[] = await responseUsers.json()
        console.log(responseBody)
        expect(responseBody.length).toBe(5);
    });

    test('14.2 Проверка удаления всех юзеров', async ({request}) => {
        await prepareEnv(request);
        await UserDTO.createUsers(5, request);
        const responseUsers = await request.get(`${baseURLWithEndpoint}`);
        const responseBody: UserDTO[] = await responseUsers.json()
        expect(responseBody.length).toBe(5);

        for (let i=0; i<responseBody.length; i++) {
            await request.delete(`${baseURLWithEndpoint}/${responseBody[i].id}`);
        }

        const responseUsersAfterDeletion = await request.get(`${baseURLWithEndpoint}`);
        const responseUsersAfterDeletionJson: UserDTO[] = await responseUsersAfterDeletion.json()
        expect(responseUsersAfterDeletionJson.length).toBe(0);
    });

    test('14.3 Проверка удаления одного из юзеров', async ({request}) => {
        await prepareEnv(request);
        await UserDTO.createUsers(5, request);
        const responseUsers = await request.get(`${baseURLWithEndpoint}`);
        const responseBody: UserDTO[] = await responseUsers.json() // 5
        const id = responseBody[0].id;
        await request.delete(`${baseURLWithEndpoint}/${id}`);
        const responseUsersAfterDeletion = await request.get(`${baseURLWithEndpoint}`);
        const responseUsersAfterDeletionJson: UserDTO[] = await responseUsersAfterDeletion.json() // 4

        expect(responseBody.length).toBeGreaterThan(responseUsersAfterDeletionJson.length);
    });
});
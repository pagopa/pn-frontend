import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from "../../../redux/auth/__test__/test-utils";
import { ExternalRegistriesAPI } from "../External-registries.api";
import { apiClient } from "../../apiClients";
import { GET_ALL_ACTIVATED_PARTIES } from "../external-registries-routes";
import { cleanupMock, mockApi } from '../../../__test__/test-utils';

describe('ExternalRegistries API tests', () => {
  mockAuthentication();
  it('getAllActivatedParties 200', async () => {
    const mock = mockApi(apiClient, 'GET', GET_ALL_ACTIVATED_PARTIES(undefined), 200, undefined, []);
    const res = await ExternalRegistriesAPI.getAllActivatedParties();
    expect(res).toStrictEqual([]);
    cleanupMock(mock);
  })

  it('getAllActivatedParties with status code 400', async () => {
    const mock = mockApi(apiClient, 'GET', GET_ALL_ACTIVATED_PARTIES(undefined), 400, undefined, { error: "Invalid request" });
    await expect(ExternalRegistriesAPI.getAllActivatedParties()).rejects.toThrow("Request failed with status code 400");
    cleanupMock(mock);
  });

  it('getAllActivatedParties with status code 500', async () => {
    const mock = mockApi(apiClient, 'GET', GET_ALL_ACTIVATED_PARTIES(undefined), 500, undefined, { error: "Internal Server Error" });
    await expect(ExternalRegistriesAPI.getAllActivatedParties()).rejects.toThrow("Request failed with status code 500");
    cleanupMock(mock);
  });
})
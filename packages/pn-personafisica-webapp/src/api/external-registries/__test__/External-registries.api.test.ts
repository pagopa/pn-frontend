import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from "../../../redux/auth/__test__/test-utils";
import { ExternalRegistriesAPI } from "../External-registries.api";
import { apiClient } from "../../apiClients";
import { GET_ALL_ACTIVATED_PARTIES } from "../external-registries-routes";
import { mockApi } from '../../../__test__/test-utils';

describe('ExternalRegistries API tests', () => {
  let mock: MockAdapter;
  mockAuthentication();
  afterEach(() => {
    if (mock) {
      mock.restore();
      mock.reset();
    }
  });

  it('getAllActivatedParties 200', async () => {
    mockApi(apiClient, 'GET', GET_ALL_ACTIVATED_PARTIES(undefined), 200, undefined, []);
    const res = await ExternalRegistriesAPI.getAllActivatedParties();
    expect(res).toStrictEqual([]);
  });
})
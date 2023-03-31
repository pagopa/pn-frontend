import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication} from "../../../redux/auth/__test__/test-utils";
import { ExternalRegistriesAPI } from "../External-registries.api";
import { apiClient } from "../../apiClients";
import { GET_ALL_ACTIVATED_PARTIES } from "../external-registries-routes";

describe('ExternalRegistries API tests', () => {
  mockAuthentication();
  test('getAllActivatedParties 200', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onGet(GET_ALL_ACTIVATED_PARTIES(undefined)).reply(200, []);
    const res = await ExternalRegistriesAPI.getAllActivatedParties();
    expect(res).toStrictEqual([]);
    mock.reset();
    mock.restore();
  })
})
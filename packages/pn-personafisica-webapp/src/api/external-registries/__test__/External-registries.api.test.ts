import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { parties } from '../../../__mocks__/Parties.mock';
import { apiClient } from '../../apiClients';
import { ExternalRegistriesAPI } from '../External-registries.api';
import { GET_ALL_ACTIVATED_PARTIES } from '../external-registries-routes';

describe('ExternalRegistries API tests', () => {
  let mock: MockAdapter;

  mockAuthentication();

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('getAllActivatedParties', async () => {
    mock.onGet(GET_ALL_ACTIVATED_PARTIES(undefined)).reply(200, parties);
    const res = await ExternalRegistriesAPI.getAllActivatedParties();
    expect(res).toStrictEqual(parties);
  });
});

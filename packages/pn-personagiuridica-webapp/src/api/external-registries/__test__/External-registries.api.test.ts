import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { parties } from '../../../__mocks__/ExternalRegistry.mock';
import { GroupStatus } from '../../../models/groups';
import { getApiClient } from '../../apiClients';
import { ExternalRegistriesAPI } from '../External-registries.api';
import { GET_ALL_ACTIVATED_PARTIES, GET_GROUPS } from '../external-registries-routes';

describe('ExternalRegistries API tests', () => {
  let mock: MockAdapter;

  mockAuthentication();

  beforeAll(() => {
    mock = new MockAdapter(getApiClient());
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

  it('getGroups 200', async () => {
    const response = [
      {
        id: 'group-1',
        name: 'Group 1',
        description: 'This is a mocked group',
        status: GroupStatus.ACTIVE,
      },
    ];
    mock.onGet(GET_GROUPS()).reply(200, response);
    const res = await ExternalRegistriesAPI.getGroups();
    expect(res).toStrictEqual(response);
  });
});

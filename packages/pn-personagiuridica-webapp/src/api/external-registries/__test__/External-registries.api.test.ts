import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { GroupStatus } from '../../../models/groups';
import { apiClient } from '../../apiClients';
import { ExternalRegistriesAPI } from '../External-registries.api';
import { GET_ALL_ACTIVATED_PARTIES, GET_GROUPS } from '../external-registries-routes';

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

  it('getAllActivatedParties 200', async () => {
    mock.onGet(GET_ALL_ACTIVATED_PARTIES(undefined)).reply(200, []);
    const res = await ExternalRegistriesAPI.getAllActivatedParties();
    expect(res).toStrictEqual([]);
  });

  it('getGroups 200', async () => {
    mock.onGet(GET_GROUPS()).reply(200, [
      {
        id: 'group-1',
        name: 'Group 1',
        description: 'This is a mocked group',
        status: GroupStatus.ACTIVE,
      },
    ]);
    const res = await ExternalRegistriesAPI.getGroups();
    expect(res).toStrictEqual([
      {
        id: 'group-1',
        name: 'Group 1',
        description: 'This is a mocked group',
        status: GroupStatus.ACTIVE,
      },
    ]);
  });
});

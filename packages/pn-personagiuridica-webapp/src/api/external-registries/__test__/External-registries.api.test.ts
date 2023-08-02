import MockAdapter from 'axios-mock-adapter';

import { mockApi } from '../../../__test__/test-utils';
import { mockAuthentication } from '../../../redux/auth/__test__/test-utils';
import { GroupStatus } from '../../../models/groups';
import { apiClient } from '../../apiClients';
import { ExternalRegistriesAPI } from '../External-registries.api';
import { GET_ALL_ACTIVATED_PARTIES, GET_GROUPS } from '../external-registries-routes';

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
  })

  it('getGroups 200', async () => {
    mockApi(apiClient, 'GET', GET_GROUPS(), 200, undefined, [
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

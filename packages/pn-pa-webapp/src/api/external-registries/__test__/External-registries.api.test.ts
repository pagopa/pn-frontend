import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { Party } from '../../../models/party';
import { apiClient } from '../../apiClients';
import { ExternalRegistriesAPI } from '../External-registries.api';
import { GET_PARTY_FOR_ORGANIZATION } from '../external-registries-routes';

describe('External registries api tests', () => {
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

  it('getOrganizationParty', async () => {
    const partyMock: Party = { id: 'id-toto', name: 'Totito' };
    mock.onGet(GET_PARTY_FOR_ORGANIZATION('id-toto')).reply(200, [partyMock]);
    const res = await ExternalRegistriesAPI.getOrganizationParty('id-toto');
    expect(res).toStrictEqual(partyMock);
  });
});

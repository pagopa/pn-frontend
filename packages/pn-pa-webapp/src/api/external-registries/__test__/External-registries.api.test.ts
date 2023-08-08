import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { Party } from '../../../models/party';
import { apiClient } from '../../apiClients';
import { GET_PARTY_FOR_ORGANIZATION } from '../external-registries-routes';
import { ExternalRegistriesAPI } from '../External-registries.api';

describe('External registries api tests', () => {
  mockAuthentication();

  it('getOrganizationParty', async () => {
    const partyMock: Party = { id: 'id-toto', name: 'Totito' };
    const mock = new MockAdapter(apiClient);
    mock.onGet(GET_PARTY_FOR_ORGANIZATION('id-toto')).reply(200, [partyMock]);
    const res = await ExternalRegistriesAPI.getOrganizationParty('id-toto');
    expect(res).toStrictEqual(partyMock);
    mock.reset();
    mock.restore();
  });
});

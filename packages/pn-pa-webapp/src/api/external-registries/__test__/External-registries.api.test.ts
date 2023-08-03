import { mockApi } from '../../../__test__/test-utils';
import { Party } from '../../../models/party';
import { mockAuthentication } from '../../../redux/auth/__test__/test-utils';
import { apiClient } from '../../apiClients';
import { GET_PARTY_FOR_ORGANIZATION } from '../external-registries-routes';
import { ExternalRegistriesAPI } from '../External-registries.api';

describe('External registries api tests', () => {
  mockAuthentication();

  it('getOrganizationParty', async () => {
    const partyMock: Party = { id: 'id-toto', name: 'Totito' };

    const axiosMock = mockApi(apiClient, 'GET', GET_PARTY_FOR_ORGANIZATION('id-toto'), 200, undefined, [partyMock]);
    const res = await ExternalRegistriesAPI.getOrganizationParty('id-toto');
    expect(res).toStrictEqual(partyMock);
    axiosMock.reset();
    axiosMock.restore();
  });
});




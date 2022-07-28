import MockAdapter from 'axios-mock-adapter';

import { apiClient } from '../../axios';
import { mockAuthentication } from '../../../redux/auth/__test__/test-utils';
import { GET_PARTY_FOR_ORGANIZATION } from '../external-registries-routes';
import { ExternalRegistriesAPI } from '../External-registries.api';
import { Party } from '../../../models/party';

describe('External registries api tests', () => {
  mockAuthentication();

  it('getOrganizationParty', async () => {
    const partyMock: Party = { id: 'id-toto', name: 'Totito' };

    const axiosMock = new MockAdapter(apiClient);
    axiosMock.onGet(GET_PARTY_FOR_ORGANIZATION('id-toto')).reply(200, [partyMock]);
    const res = await ExternalRegistriesAPI.getOrganizationParty('id-toto');
    expect(res).toStrictEqual(partyMock);
    axiosMock.reset();
    axiosMock.restore();
  });
});




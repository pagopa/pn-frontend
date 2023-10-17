import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { Party } from '../../../models/party';
import { apiClient } from '../../apiClients';
import { GET_INSTITUTIONS, GET_INSTITUTION_PRODUCTS, GET_PARTY_FOR_ORGANIZATION } from '../external-registries-routes';
import { ExternalRegistriesAPI } from '../External-registries.api';
import { institutionsList, institutionsDTO, productsList, productsDTO } from '../../../__mocks__/User.mock';

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

  it('getInstitutions', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onGet(GET_INSTITUTIONS()).reply(200, institutionsDTO);
    const res = await ExternalRegistriesAPI.getInstitutions();
    expect(res).toStrictEqual(institutionsList);
    mock.reset();
    mock.restore();
  });

  it('getInstitutionProducts', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onGet(GET_INSTITUTION_PRODUCTS('1')).reply(200, productsDTO);
    const res = await ExternalRegistriesAPI.getInstitutionProducts('1');
    expect(res).toStrictEqual(productsList);
    mock.reset();
    mock.restore();
  });

});

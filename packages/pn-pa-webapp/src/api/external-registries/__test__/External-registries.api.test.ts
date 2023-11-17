import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { Party } from '../../../models/party';
import { getApiClient } from '../../apiClients';
import { GET_INSTITUTIONS, GET_INSTITUTION_PRODUCTS, GET_PARTY_FOR_ORGANIZATION } from '../external-registries-routes';
import { ExternalRegistriesAPI } from '../External-registries.api';
import { institutionsList, institutionsDTO, productsList, productsDTO } from '../../../__mocks__/User.mock';

describe('External registries api tests', () => {
  let mock: MockAdapter;

  mockAuthentication();

  beforeAll(()=> {
    mock = new MockAdapter(getApiClient());
  });

  afterEach(()=> {
    mock.reset();
  });
  
  afterAll(()=> {
    mock.restore();
  });

  it('getOrganizationParty', async () => {
    const partyMock: Party = { id: 'id-toto', name: 'Totito' };
    mock.onGet(GET_PARTY_FOR_ORGANIZATION('id-toto')).reply(200, [partyMock]);
    const res = await ExternalRegistriesAPI.getOrganizationParty('id-toto');
    expect(res).toStrictEqual(partyMock);
  });

  it('getInstitutions', async () => {
    mock.onGet(GET_INSTITUTIONS()).reply(200, institutionsDTO);
    const res = await ExternalRegistriesAPI.getInstitutions();
    expect(res).toStrictEqual(institutionsList);
  });

  it('getInstitutionProducts', async () => {
    mock.onGet(GET_INSTITUTION_PRODUCTS('1')).reply(200, productsDTO);
    const res = await ExternalRegistriesAPI.getInstitutionProducts('1');
    expect(res).toStrictEqual(productsList);
  });

});

import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import {
  institutionsDTO,
  institutionsList,
  productsDTO,
  productsList,
} from '../../../__mocks__/User.mock';
import { Party } from '../../../models/party';
import { apiClient } from '../../apiClients';
import { ExternalRegistriesAPI } from '../External-registries.api';
import {
  GET_INSTITUTIONS,
  GET_INSTITUTION_PRODUCTS,
  GET_PARTY_FOR_ORGANIZATION,
} from '../external-registries-routes';

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

  it('getInstitutions', async () => {
    mock.onGet(GET_INSTITUTIONS()).reply(200, institutionsDTO);
    const res = await ExternalRegistriesAPI.getInstitutions();
    expect(res).toStrictEqual(institutionsList);
  });

  it('getInstitutionProducts', async () => {
    const institutionId = '1';
    const products = productsList.map((product) => ({
      ...product,
      productUrl: `mock-selfcare.base/token-exchange?institutionId=${institutionId}&productId=mock-prod-id`,
    }));

    mock.onGet(GET_INSTITUTION_PRODUCTS(institutionId)).reply(200, productsDTO);
    const res = await ExternalRegistriesAPI.getInstitutionProducts('1');
    expect(res).toStrictEqual(products);
  });
});

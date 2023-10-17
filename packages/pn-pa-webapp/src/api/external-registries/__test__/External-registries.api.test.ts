import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { Party } from '../../../models/party';
import { apiClient } from '../../apiClients';
import { GET_INSTITUTIONS, GET_INSTITUTION_PRODUCTS, GET_PARTY_FOR_ORGANIZATION } from '../external-registries-routes';
import { ExternalRegistriesAPI } from '../External-registries.api';
import { partyListDTO, productsListDTO } from '../../../__mocks__/User.mock';
import { PartyEntity, ProductSwitchItem } from '@pagopa/mui-italia';

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
    mock.onGet(GET_INSTITUTIONS()).reply(200, partyListDTO);
    const res = await ExternalRegistriesAPI.getInstitutions();
    const institutions: Array<PartyEntity> = partyListDTO.map((institution) => (
      {
        id: institution.id,
        name: institution.description,
        productRole: institution.userProductRoles[0],
        logoUrl: undefined
      }
    ));
    expect(res).toStrictEqual(institutions);
    mock.reset();
    mock.restore();
  });

  it('getInstitutionProducts', async () => {
    const mock = new MockAdapter(apiClient);
    mock.onGet(GET_INSTITUTION_PRODUCTS('1')).reply(200, productsListDTO);
    const res = await ExternalRegistriesAPI.getInstitutionProducts('1');
    const products: Array<ProductSwitchItem> = productsListDTO.map((product) => (
      {
        id: product.id,
        title: product.title,
        productUrl: product.urlBO,
        linkType: 'internal'
      }
    ));
    expect(res).toStrictEqual(products);
    mock.reset();
    mock.restore();
  });

});

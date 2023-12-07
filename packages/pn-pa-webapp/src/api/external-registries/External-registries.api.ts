import { AxiosResponse } from 'axios';

import { Institution, PartyEntityWithUrl, Product } from '@pagopa-pn/pn-commons';
import { ProductEntity } from '@pagopa/mui-italia';

import { Party } from '../../models/party';
import { getConfiguration } from '../../services/configuration.service';
import { apiClient } from '../apiClients';
import {
  GET_INSTITUTIONS,
  GET_INSTITUTION_PRODUCTS,
  GET_PARTY_FOR_ORGANIZATION,
} from './external-registries-routes';

export const ExternalRegistriesAPI = {
  /**
   * Gets the Party object for the organization whose id is given.
   * 
   * NB: in fact, the called endpoint expects an array of party ids and yields an array of Party objects.
   *     As the aim of calling this endpoint for this application is limited to a single organization,
   *     I decided to encapsulate the array nature of the endpoint inside the api definition.
   *     ---------------
   *     Carlos Lombardi, 2022.07.27
   @deprecated since PN-5881
   */
  getOrganizationParty: (organizationId: string): Promise<Party> =>
    apiClient
      .get<Array<Party>>(GET_PARTY_FOR_ORGANIZATION(organizationId))
      .then((response: AxiosResponse<Array<Party>>) => response.data[0]),

  getInstitutions: (): Promise<Array<PartyEntityWithUrl>> =>
    apiClient
      .get<Array<Institution>>(GET_INSTITUTIONS())
      .then((response: AxiosResponse<Array<Institution>>) =>
        response.data.map((institution) => ({
          id: institution.id,
          name: institution.description,
          productRole: institution.userProductRoles[0],
          logoUrl: undefined,
          parentName: institution.rootParent?.description,
          entityUrl: `${getConfiguration().SELFCARE_BASE_URL}/token-exchange?institutionId=${
            institution.id
          }&productId=${getConfiguration().SELFCARE_SEND_PROD_ID}`,
        }))
      ),

  getInstitutionProducts: (institutionId: string): Promise<Array<ProductEntity>> =>
    apiClient
      .get<Array<Product>>(GET_INSTITUTION_PRODUCTS(institutionId))
      .then((response: AxiosResponse<Array<Product>>) =>
        response.data.map((product) => ({
          id: product.id,
          title: product.title,
          productUrl: `${
            getConfiguration().SELFCARE_BASE_URL
          }/token-exchange?institutionId=${institutionId}&productId=${product.id}`,
          linkType: 'external',
        }))
      ),
};

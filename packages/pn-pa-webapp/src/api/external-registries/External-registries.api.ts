import { AxiosResponse } from 'axios';
import { Party } from '../../models/party';
import { apiClient } from '../axios';

import { GET_PARTY_FOR_ORGANIZATION } from './external-registries-routes';

/* eslint-disable functional/no-let */
let mockCounter = 0;

export const ExternalRegistriesAPI = {
  /**
   * Gets the Party object for the organization whose id is given.
   * 
   * NB: in fact, the called endpoint expects an array of party ids and yields an array of Party objects.
   *     As the aim of calling this endpoint for this application is limited to a single organization,
   *     I decided to encapsulate the array nature of the endpoint inside the api definition.
   *     ---------------
   *     Carlos Lombardi, 2022.07.27
   */
  getOrganizationParty: (organizationId: string): Promise<Party> =>
    apiClient
      .get<Array<Party>>(GET_PARTY_FOR_ORGANIZATION(organizationId))
      .then((response: AxiosResponse<Array<Party>>) => {
        mockCounter++;
        if (mockCounter % 3 === 1) {
          return Promise.reject({ response: { status: 500 } });
        }
        return response.data[0];
      }),
      // .then(() => Promise.reject({ response: { status: 500 } })),
      // .then((response: AxiosResponse<Array<Party>>) => response.data[0]),
};

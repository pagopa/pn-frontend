import { AxiosResponse } from 'axios';
import { Party } from '../../models/party';
import { apiClient } from '../axios';

import { GET_PARTY_FOR_ORGANIZATION } from './external-registries-routes';

export const ExternalRegistriesAPI = {
  /**
   * Gets the Party object for the organization whose id is given.
   * NB: in fact, the called endpoint expects an array of party ids and yields an array of Party objects.
   *     As the aim of calling this endpoint for this application is limited to a single organization,
   *     I decided to encapsulate the array nature of the endpoint inside the api definition.
   *     ---------------
   *     Carlos Lombardi, 2022.07.27
   */
  getOrganizationParty: (organizationId: string): Promise<Party> => 
    organizationId === 'b6c5b42a-8a07-436f-96ce-8c2ab7f4dbd2'
      ? Promise.resolve({
          id: 'b6c5b42a-8a07-436f-96ce-8c2ab7f4dbd2',
          name: 'Comune di Valsamoggia',
        })
      : apiClient
          .get<Array<Party>>(GET_PARTY_FOR_ORGANIZATION(organizationId))
          .then((response: AxiosResponse<Array<Party>>) => {
            console.log(response.data);
            return response.data[0];
          })
  ,
};

  // getOrganizationPartyTentativoDisperato: (organizationId: string): Promise<Party> => {
  //   console.log({ organizationId });
  //   // return Promise.resolve({
  //   //   id: 'b6c5b42a-8a07-436f-96ce-8c2ab7f4dbd2',
  //   //   name: 'Comune di Valsamoggia',
  //   // });
  //   return organizationId === 'b6c5b42a-8a07-436f-96ce-8c2ab7f4dbd2'
  //     ? Promise.resolve({
  //         id: 'b6c5b42a-8a07-436f-96ce-8c2ab7f4dbd2',
  //         name: 'Comune di Valsamoggia',
  //       })
  //     : apiClient
  //         .get<Array<Party>>(GET_PARTY_FOR_ORGANIZATION(organizationId))
  //         .then((response: AxiosResponse<Array<Party>>) => {
  //           console.log(response.data);
  //           return response.data[0];
  //         });
  // },


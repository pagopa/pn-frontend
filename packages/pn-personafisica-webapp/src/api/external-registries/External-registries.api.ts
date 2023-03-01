import { AxiosResponse } from 'axios';
import { apiClient } from '../apiClients';
import { Party } from '../../models/party';

import { GET_ALL_ACTIVATED_PARTIES } from '../external-registries/external-registries-routes';
import { filterEntitiesBE } from '../../redux/newDelegation/types';

export const ExternalRegistriesAPI = {
  getAllActivatedParties: (payload?: filterEntitiesBE): Promise<Array<Party>> =>
    apiClient
      .get<Array<Party>>(GET_ALL_ACTIVATED_PARTIES(payload))
      .then((response: AxiosResponse<Array<Party>>) => response.data),
};

import { AxiosResponse } from 'axios';
import { apiClient } from '../apiClients';
import { FilterEntitiesBE, Party } from '../../models/party';

import { GET_ALL_ACTIVATED_PARTIES } from '../external-registries/external-registries-routes';

export const ExternalRegistriesAPI = {
  getAllActivatedParties: (payload?: FilterEntitiesBE): Promise<Array<Party>> =>
    apiClient
      .get<Array<Party>>(GET_ALL_ACTIVATED_PARTIES(payload))
      .then((response: AxiosResponse<Array<Party>>) => response.data),
};

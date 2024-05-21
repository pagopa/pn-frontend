import { AxiosResponse } from 'axios';
import { apiClient } from '../apiClients';
import { FilterPartiesParams, Party } from '../../models/party';

import { GET_ALL_ACTIVATED_PARTIES } from './external-registries-routes';

export const ExternalRegistriesAPI = {
  getAllActivatedParties: (payload?: FilterPartiesParams): Promise<Array<Party>> =>
    apiClient
      .get<Array<Party>>(
        GET_ALL_ACTIVATED_PARTIES(
          payload && payload.paNameFilter ? { paNameFilter: payload.paNameFilter } : undefined
        )
      )
      .then((response: AxiosResponse<Array<Party>>) => response.data),
};

import { AxiosResponse } from 'axios';
import { apiClient } from '../apiClients';
import { FilterPartiesParams, Party } from '../../models/party';

import { Groups } from '../../models/groups';
import { GET_ALL_ACTIVATED_PARTIES, GET_GROUPS } from './external-registries-routes';

export const ExternalRegistriesAPI = {
  getAllActivatedParties: (payload?: FilterPartiesParams): Promise<Array<Party>> =>
    apiClient
      .get<Array<Party>>(
        GET_ALL_ACTIVATED_PARTIES(
          payload && payload.paNameFilter ? { paNameFilter: payload.paNameFilter } : undefined
        )
      )
      .then((response: AxiosResponse<Array<Party>>) => response.data),

  /**
   * Get PG groups
   * @param payload
   * @returns
   */
  getGroups: (): Promise<Array<Groups>> =>
    apiClient
      .get<Array<Groups>>(GET_GROUPS())
      .then((response: AxiosResponse<Array<Groups>>) => response.data),
};

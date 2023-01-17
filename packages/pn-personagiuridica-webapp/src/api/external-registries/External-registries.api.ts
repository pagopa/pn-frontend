import { AxiosResponse } from 'axios';
import { apiClient } from '../apiClients';
import { Party } from '../../models/party';

import { GET_ALL_ACTIVATED_PARTIES } from './external-registries-routes';

export const ExternalRegistriesAPI = {
  getAllActivatedParties: (): Promise<Array<Party>> =>
    apiClient
      .get<Array<Party>>(GET_ALL_ACTIVATED_PARTIES())
      .then((response: AxiosResponse<Array<Party>>) => response.data),
};

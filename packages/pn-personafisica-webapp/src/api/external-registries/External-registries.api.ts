import { AxiosResponse } from 'axios';
import { apiClient } from '../axios';
import { Party } from '../../models/party';

import { GET_ALL_ACTIVATED_PARTIES } from '../external-registries/external-registries-routes';

export const ExternalRegistriesAPI = {
  getAllActivatedParties: (): Promise<Array<Party>> =>
    apiClient
      .get<Array<Party>>(GET_ALL_ACTIVATED_PARTIES())
      .then((response: AxiosResponse<Array<Party>>) => response.data),
};

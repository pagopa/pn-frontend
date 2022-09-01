import { AxiosResponse } from 'axios';
import { apiClient } from '../axios';
import { Party } from '../../models/party';

import { GET_ALL_ACTIVATED_PARTIES } from '../external-registries/external-registries-routes';

/* eslint-disable-next-line functional/no-let */
let niceCounter = 0;

export const ExternalRegistriesAPI = {
  getAllActivatedParties: (): Promise<Array<Party>> =>
    apiClient
      .get<Array<Party>>(GET_ALL_ACTIVATED_PARTIES())
      // .then((response: AxiosResponse<Array<Party>>) => response.data),
      .then((response: AxiosResponse<Array<Party>>) => {
        niceCounter++;
        if (niceCounter % 2 === 0) {
          return response.data;
        } else {
          return Promise.reject({ response: { status: 500 } });
        }
        }),
};

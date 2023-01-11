import { Party } from '../../models/party';

export const ExternalRegistriesAPI = {
  /* getAllActivatedParties: (): Promise<Array<Party>> =>
    apiClient
      .get<Array<Party>>(GET_ALL_ACTIVATED_PARTIES())
      .then((response: AxiosResponse<Array<Party>>) => response.data), */
  getAllActivatedParties: (): Promise<Array<Party>> =>
    Promise.resolve([
      { id: '9115f90b-1dc9-4ba8-8645-b38bda016b8f', name: 'Unione Dei Comuni del Golfo Paradiso' },
      {
        id: '7ac8d531-9c46-48eb-965a-25c12fa1fd81',
        name: 'Istituto Nazionale Previdenza Sociale - INPS',
      },
    ]),
};

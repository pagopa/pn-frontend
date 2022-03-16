import { AxiosPromise } from 'axios';
import { apiClient, authClient } from '../axios';
import { Delegation } from '../../redux/delegation/types';

export const DelegatesApi = {
  /*
   * Get all the delegation for the authenticated user
   * @returns Promise array of delegations
   */
  getDelegations: (): AxiosPromise<Array<Delegation>> => authClient.get('/delegations'),

  createDelegation: (data: any): Promise<Delegation | 'error'> =>
    apiClient.post('/mandate', data).then((response) => {
      if (response.data) {
        return response.data as Delegation;
      }

      return 'error';
    }),
};

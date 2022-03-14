import { AxiosPromise } from 'axios';
import { apiClient, authClient } from '../axios';
import { Delegation } from '../../redux/delegation/types';

export const DelegatesApi = {
  /*
   * Get all the delegation for the authenticated user
   * @returns Promise array of delegations
   */
  getDelegations: (): AxiosPromise<Array<Delegation>> => authClient.get('/delegations'),
  revokeDelegation: (id: string): Promise<'success' | 'error'> =>
    apiClient.patch(`/delegations/${id}/revoke`).then((response) => {
      if (response.status === 204) {
        return 'success';
      }
      return 'error';
    }),
};

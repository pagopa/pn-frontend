import { AxiosPromise } from 'axios';
import { apiClient } from '../axios';
import { Delegation } from '../../redux/delegation/types';

export const DelegationsApi = {
  /*
   * Get all the delegation for the authenticated user
   * @returns Promise array of delegations
   */
  getDelegates: (): AxiosPromise<Array<Delegation>> => apiClient.get('/mandates-by-delegate'),
  getDelegators: (): AxiosPromise<Array<Delegation>> => apiClient.get('/mandates-by-delegators'),
  revokeDelegation: (id: string): Promise<'success' | 'error'> =>
    apiClient.patch(`/delegations/${id}/revoke`).then((response) => {
      if (response.status === 204) {
        return 'success';
      }
      return 'error';
    }),
  rejectDelegation: (id: string): Promise<'success' | 'error'> =>
    apiClient.patch(`/delegations/${id}/reject`).then((response) => {
      if (response.status === 204) {
        return 'success';
      }
      return 'error';
    }),
};

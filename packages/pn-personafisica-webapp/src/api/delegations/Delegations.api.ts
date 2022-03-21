import { AxiosPromise } from 'axios';
import { apiClient } from '../axios';
import { Delegation } from '../../redux/delegation/types';
import { CreateDelegationProps } from '../../redux/newDelegation/actions';

// TODO: change to requested behaviour when implementing API
function checkResponseStatus(response: any, id: string) {
  if (response.status === 204) {
    return { id };
  }
  return { id: '-1' };
}

export const DelegationsApi = {
  /*
   * Get all the delegation for the authenticated user
   * @returns Promise array of delegations
   */
  getDelegates: (): AxiosPromise<Array<Delegation>> => apiClient.get('/mandates-by-delegate'),
  getDelegators: (): AxiosPromise<Array<Delegation>> => apiClient.get('/mandates-by-delegators'),
  revokeDelegation: (id: string): Promise<{ id: string }> =>
    apiClient
      .patch(`/delegations/${id}/revoke`)
      .then((response) => checkResponseStatus(response, id)),
  rejectDelegation: (id: string): Promise<{ id: string }> =>
    apiClient
      .patch(`/delegations/${id}/reject`)
      .then((response) => checkResponseStatus(response, id)),
  acceptDelegation: (id: string): Promise<{ id: string }> =>
    apiClient
      .patch(`/delegations/${id}/accept`)
      .then((response) => checkResponseStatus(response, id)),
  createDelegation: (data: any): Promise<CreateDelegationProps | 'error'> =>
    apiClient.post('/mandate', data).then((response) => {
      if (response.data) {
        return response.data as CreateDelegationProps;
      }

      return 'error';
    }),
};

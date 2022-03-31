import { AxiosPromise, AxiosResponse } from 'axios';
import { apiClient } from '../axios';
import { Delegation } from '../../redux/delegation/types';
import { CreateDelegationProps } from '../../redux/newDelegation/actions';

// TODO: change to requested behaviour when implementing API
function checkResponseStatus(response: AxiosResponse, id: string) {
  if (response.status === 200) {
    return { id };
  }
  return { id: '-1' };
}

function getDelegationsResponse(response: AxiosResponse<Array<Delegation>>) {
  if (response.data) {
    return response.data;
  }
  return [] as Array<Delegation>;
}

export const DelegationsApi = {
  /**
   * Get all the delegates for the authenticated user
   * @returns {Promise<Array<Delegation>>}
   */
  getDelegates: (): Promise<Array<Delegation>> =>
    apiClient
      .get<Array<Delegation>>('/mandate/api/v1/mandates-by-delegator')
      .then((response: AxiosResponse<Array<Delegation>>) => getDelegationsResponse(response)),

  /**
   * Get all the delegators for the authenticated user
   * @return {Promise<Array<Delegation>>}
   */
  getDelegators: (): Promise<Array<Delegation>> =>
    apiClient
      .get<Array<Delegation>>('/mandate/api/v1/mandates-by-delegate')
      .then((response: AxiosResponse<Array<Delegation>>) => getDelegationsResponse(response)),
  /**
   * Removes a delegation that the user created
   * @param id
   * @return {Promise<{id: string} | {id: string}>}
   */
  revokeDelegation: (id: string): Promise<{ id: string }> =>
    apiClient
      .patch(`/mandate/api/v1/mandate/${id}/revoke`)
      .then((response) => checkResponseStatus(response, id)),
  /**
   * Removes a delegation created for the user
   * @param {string} id
   * @returns {Promise<{id: string} | {id: string}>}
   */
  rejectDelegation: (id: string): Promise<{ id: string }> =>
    apiClient
      .patch<{ id: string }>(`/mandate/api/v1/mandate/${id}/reject`)
      .then((response) => checkResponseStatus(response, id)),
  /**
   * Accepts a delegation created for the user
   * @param {string} id
   * @returns Promise
   */
  acceptDelegation: (id: string): Promise<{ id: string }> =>
    apiClient
      .patch<{ id: string }>(`/mandate/api/v1/mandate/${id}/accept`)
      .then((response: AxiosResponse) => checkResponseStatus(response, id)),
  /**
   * Creates a new delegation
   * @param {object} data
   * @returns {Promise<"success" | "error" | "success">}
   */
  createDelegation: (data: CreateDelegationProps): Promise<'success' | 'error'> =>
    apiClient
      .post<CreateDelegationProps>('/mandate/api/v1/mandate', data)
      .then((response: AxiosResponse<CreateDelegationProps>) => {
        if (response.data) {
          return 'success';
        }
        return 'error';
      }),
};

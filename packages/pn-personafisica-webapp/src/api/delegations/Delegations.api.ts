import { AxiosPromise, AxiosResponse } from 'axios';
import { apiClient } from '../axios';
import { AcceptDelegationResponse, Delegation } from '../../redux/delegation/types';
import { CreateDelegationProps, CreateDelegationResponse } from '../../redux/newDelegation/actions';

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
   * @return {Promise<{id: string}>}
   */
  revokeDelegation: (id: string): Promise<{ id: string }> =>
    apiClient
      .patch(`/mandate/api/v1/mandate/${id}/revoke`)
      .then((response: AxiosResponse) => checkResponseStatus(response, id)),
  /**
   * Removes a delegation created for the user
   * @param {string} id
   * @returns {Promise<{id: string}>}
   */
  rejectDelegation: (id: string): Promise<{ id: string }> =>
    apiClient
      .patch(`/mandate/api/v1/mandate/${id}/reject`)
      .then((response: AxiosResponse) => checkResponseStatus(response, id)),
  /**
   * Accepts a delegation created for the user
   * @param {string} id
   * @param data
   * @return {Promise<{id: string}>}
   */
  acceptDelegation: (
    id: string,
    data: { verificationCode: string }
  ): Promise<AcceptDelegationResponse> =>
    apiClient
      .patch<AcceptDelegationResponse>(`/mandate/api/v1/mandate/${id}/accept`, data)
      .then((response: AxiosResponse<AcceptDelegationResponse>) => {
        if (response.data) {
          return { ...response.data, id };
        }
        return {
          id: '-1',
          type: 'generic',
          status: 600,
          title: 'Errore generico',
          detail: '',
        } as AcceptDelegationResponse;
      }),
  /**
   * Creates a new delegation
   * @param data
   * @return {Promise<CreateDelegationResponse>}
   */
  createDelegation: (data: CreateDelegationProps): Promise<CreateDelegationResponse> =>
    apiClient
      .post<CreateDelegationResponse>('/mandate/api/v1/mandate', data)
      .then((response: AxiosResponse<CreateDelegationResponse>) => {
        if (response.data) {
          return response.data as CreateDelegationResponse;
        }
        return {
          datefrom: '',
          dateto: '',
          delegate: {
            firstName: '',
            lastName: '',
            companyName: null,
            fiscalCode: '',
            email: '',
            person: true,
          },
          delegator: null,
          mandateId: '',
          status: '',
          verificationCode: '',
          visibilityIds: [],
        } as CreateDelegationResponse;
      }),
};

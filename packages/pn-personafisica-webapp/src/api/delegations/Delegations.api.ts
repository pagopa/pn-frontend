import { AxiosResponse } from 'axios';
import { apiClient } from '../axios';
import {
  AcceptDelegationResponse,
  CreateDelegationProps,
  CreateDelegationResponse,
  Delegate,
  Delegation,
  Delegator,
} from '../../redux/delegation/types';

function checkResponseStatus(response: AxiosResponse, id: string) {
  if (response.status === 200) {
    return { id };
  }
  return { id: '-1' };
}

export const DelegationsApi = {
  /**
   * Get all the delegates for the authenticated user
   * @returns {Promise<Array<Delegation>>}
   */
  getDelegates: (): Promise<Array<Delegate>> =>
    apiClient
      .get<Array<Delegation>>('/mandate/api/v1/mandates-by-delegator')
      .then((response: AxiosResponse<Array<Delegation>>) =>
        response.data.map((delegation) => ({
          mandateId: delegation.mandateId,
          status: delegation.status,
          visibilityIds: delegation.visibilityIds,
          verificationCode: delegation.verificationCode,
          datefrom: delegation.datefrom,
          dateto: delegation.dateto,
          delegate: 'delegate' in delegation ? delegation.delegate : null,
        }))
      ),

  /**
   * Get all the delegators for the authenticated user
   * @return {Promise<Array<Delegation>>}
   */
  getDelegators: (): Promise<Array<Delegator>> =>
    apiClient
      .get<Array<Delegation>>('/mandate/api/v1/mandates-by-delegate')
      .then((response: AxiosResponse<Array<Delegation>>) =>
        response.data.map((delegation) => ({
          mandateId: delegation.mandateId,
          status: delegation.status,
          visibilityIds: delegation.visibilityIds,
          verificationCode: delegation.verificationCode,
          datefrom: delegation.datefrom,
          dateto: delegation.dateto,
          delegator: 'delegator' in delegation ? delegation.delegator : null,
        }))
      ),
  // new Promise((resolve, _reject) => {
  //   return resolve([
  //     {
  //       mandateId: 'mandateIdProva',
  //       status: 'active',
  //       visibilityIds: [],
  //       verificationCode: '1234',
  //       datefrom: '2021-12-28+01:00',
  //       dateto: '',
  //       delegator: {
  //         firstName: 'Carlotta',
  //         lastName: 'Dimatteo',
  //         displayName: undefined,
  //         companyName: undefined,
  //         fiscalCode: 'DNTCLD90E63D628I',
  //         person: true,
  //       },
  //     },
  //   ]);
  // }),
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
        if (response.status === 200) {
          return { ...response.data, id };
        }
        return {
          id: '-1',
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

  getAllEntities: () : Promise<any> =>apiClient.get('ext-registry/pa/v1/activated-on-pn').then((response: AxiosResponse<any>) => response.data)
};

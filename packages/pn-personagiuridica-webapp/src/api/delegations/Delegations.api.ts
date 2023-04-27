import { AxiosResponse } from 'axios';

import {
  AcceptDelegationResponse,
  CreateDelegationProps,
  CreateDelegationResponse,
  Delegate,
  Delegation,
  DelegationStatus,
  Delegator,
  GetDelegatorsFilters,
  GetDelegatorsResponse,
} from '../../models/Deleghe';
import { apiClient } from '../apiClients';
import {
  ACCEPT_DELEGATION,
  COUNT_DELEGATORS,
  CREATE_DELEGATION,
  DELEGATIONS_BY_DELEGATE,
  DELEGATIONS_BY_DELEGATOR,
  DELEGATIONS_NAME_BY_DELEGATE,
  REJECT_DELEGATION,
  REVOKE_DELEGATION,
} from './delegations.routes';

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
  getDelegatesByCompany: (): Promise<Array<Delegate>> =>
    apiClient
      .get<Array<Delegation>>(DELEGATIONS_BY_DELEGATOR())
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
   * @param {GetDelegatorsFilters} params
   * @return {Promise<GetDelegatorsResponse>}
   */
  getDelegators: (params: GetDelegatorsFilters): Promise<GetDelegatorsResponse> =>
    apiClient
      .post<GetDelegatorsResponse>(
        DELEGATIONS_BY_DELEGATE({ size: params.size, nextPageKey: params.nextPageKey }),
        { delegatorIds: params.delegatorIds, groups: params.groups, status: params.status }
      )
      .then((response: AxiosResponse<GetDelegatorsResponse>) => ({
        ...response.data,
        resultsPage: response.data.resultsPage.map((delegation) => ({
          mandateId: delegation.mandateId,
          status: delegation.status,
          visibilityIds: delegation.visibilityIds,
          verificationCode: delegation.verificationCode,
          datefrom: delegation.datefrom,
          dateto: delegation.dateto,
          delegator: 'delegator' in delegation ? delegation.delegator : null,
        })),
      })),

  /**
   * Removes a delegation that the user created
   * @param id
   * @return {Promise<{id: string}>}
   */
  revokeDelegation: (id: string): Promise<{ id: string }> =>
    apiClient
      .patch(REVOKE_DELEGATION(id))
      .then((response: AxiosResponse) => checkResponseStatus(response, id)),

  /**
   * Removes a delegation created for the user
   * @param {string} id
   * @returns {Promise<{id: string}>}
   */
  rejectDelegation: (id: string): Promise<{ id: string }> =>
    apiClient
      .patch(REJECT_DELEGATION(id))
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
      .patch<AcceptDelegationResponse>(ACCEPT_DELEGATION(id), data)
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
      .post<CreateDelegationResponse>(CREATE_DELEGATION(), data)
      .then((response: AxiosResponse<CreateDelegationResponse>) => response.data),

  /**
   * Count pending delegators
   * @returns {Promise<{value: number}>}
   */
  countDelegators: (): Promise<{ value: number }> =>
    apiClient
      .get<{ value: number }>(COUNT_DELEGATORS(DelegationStatus.PENDING))
      .then((response: AxiosResponse<{ value: number }>) => response.data),

  /**
   * Get all the delegators names for the authenticated user
   * @param {GetDelegatorsFilters} params
   * @return {Promise<GetDelegatorsResponse>}
   */
  getDelegatorsNames: (): Promise<Array<{ id: string; name: string }>> =>
    apiClient
      .get<Array<Delegator>>(DELEGATIONS_NAME_BY_DELEGATE())
      .then((response: AxiosResponse<Array<Delegator>>) => {
        if (response.data) {
          return response.data.map((delegator) => ({
            id: delegator.mandateId,
            name: delegator.delegator?.displayName || '',
          }));
        }
        return [];
      }),
};

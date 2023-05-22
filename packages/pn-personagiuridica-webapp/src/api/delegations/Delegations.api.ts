import { AxiosResponse } from 'axios';

import {
  AcceptDelegationResponse,
  CreateDelegationProps,
  CreateDelegationResponse,
  Delegate,
  Delegation,
  DelegationStatus,
  Delegator,
  DelegatorsNames,
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
  UPDATE_DELEGATION,
} from './delegations.routes';

function checkResponseStatus(response: AxiosResponse, id: string) {
  if (response.status === 204) {
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
        { taxId: params.taxId, groups: params.groups, status: params.status }
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
          groups: delegation.groups,
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
    data: { verificationCode: string; groups: Array<{ id: string; name: string }> }
  ): Promise<AcceptDelegationResponse> =>
    apiClient
      .patch<AcceptDelegationResponse>(ACCEPT_DELEGATION(id), {
        ...data,
        groups: data.groups.map((g) => g.id),
      })
      .then((response: AxiosResponse<AcceptDelegationResponse>) => {
        if (response.status === 204) {
          return { ...response.data, id, groups: data.groups };
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
   * @param status status of the delegation
   * @returns {Promise<{value: number}>}
   */

  countDelegators: (status: DelegationStatus): Promise<{ value: number }> =>
    apiClient
      .get<{ value: number }>(COUNT_DELEGATORS(status))
      .then((response: AxiosResponse<{ value: number }>) => response.data),

  /**
   * Get all the delegators names for the authenticated user
   * @param {GetDelegatorsFilters} params
   * @return {Promise<GetDelegatorsResponse>}
   * @deprecated since pn-5795
   */
  getDelegatorsNames: (): Promise<Array<DelegatorsNames>> =>
    apiClient
      .get<Array<Delegator>>(DELEGATIONS_NAME_BY_DELEGATE())
      .then((response: AxiosResponse<Array<Delegator>>) => {
        if (response.data) {
          return response.data.reduce((arr, delegator) => {
            /* eslint-disable functional/immutable-data */
            const isInArray = arr.findIndex((elem) => elem.id === delegator.delegator?.fiscalCode);
            if (isInArray > -1) {
              arr[isInArray].mandateIds.push(delegator.mandateId);
              return arr;
            }
            arr.push({
              id: delegator.delegator?.fiscalCode || '',
              name: delegator.delegator?.displayName || '',
              mandateIds: [delegator.mandateId],
            });
            return arr;
            /* eslint-enable functional/immutable-data */
          }, [] as Array<DelegatorsNames>);
        }
        return [];
      }),

  /**
   * Update a delegation created for the user
   * @param {string} id
   * @param data
   * @return {Promise<{id: string}>}
   */
  updateDelegation: (
    id: string,
    groups: Array<{ id: string; name: string }>
  ): Promise<AcceptDelegationResponse> =>
    apiClient
      .patch<AcceptDelegationResponse>(UPDATE_DELEGATION(id), {
        groups: groups.map((g) => g.id),
      })
      .then((response: AxiosResponse<AcceptDelegationResponse>) => {
        if (response.status === 204) {
          return { ...response.data, id, groups };
        }
        return {
          id: '-1',
        } as AcceptDelegationResponse;
      }),
};

import { AxiosResponse } from 'axios';
import { apiClient } from '../apiClients';
import {
  AcceptDelegationResponse,
  CreateDelegationProps,
  CreateDelegationResponse,
  Delegate,
  Delegation,
  Delegator,
} from '../../redux/delegation/types';
import {
  ACCEPT_DELEGATION,
  CREATE_DELEGATION,
  DELEGATIONS_BY_DELEGATE,
  DELEGATIONS_BY_DELEGATOR,
  REJECT_DELEGATION,
  REOVKE_DELEGATION,
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
  getDelegates: (): Promise<Array<Delegate>> =>
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
   * @return {Promise<Array<Delegation>>}
   */
  getDelegators: (): Promise<Array<Delegator>> =>
    apiClient
      .get<Array<Delegation>>(DELEGATIONS_BY_DELEGATE())
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
  
  /**
   * Removes a delegation that the user created
   * @param id
   * @return {Promise<{id: string}>}
   */
  revokeDelegation: (id: string): Promise<{ id: string }> =>
    apiClient
      .patch(REOVKE_DELEGATION(id))
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
      .then((response: AxiosResponse<CreateDelegationResponse>) => {
        if (response.data) {
          return response.data;
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

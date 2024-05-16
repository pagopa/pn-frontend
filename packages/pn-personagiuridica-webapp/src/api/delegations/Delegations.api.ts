import { AxiosResponse } from 'axios';

import {
  CreateDelegationProps,
  CreateDelegationResponse,
  DelegationStatus,
} from '../../models/Deleghe';
import { apiClient } from '../apiClients';
import { COUNT_DELEGATORS, CREATE_DELEGATION } from './delegations.routes';

export const DelegationsApi = {
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
};

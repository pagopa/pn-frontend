import { compileRoute } from '@pagopa-pn/pn-commons';

import { DelegationStatus } from '../../models/Deleghe';

// Prefixes
const API_DELEGATIONS_PREFIX = 'mandate';

// Segments
const API_SEGMENT = 'api';
const API_VERSION_SEGMENT = 'v1';
const API_DELEGATIONS_MANDATE = 'mandate';
const API_DELEGATIONS_COUNT_BY_DELEGATE = 'count-by-delegate';

// Parameters
const API_DELEGATIONS_STATUS_PARAMETER = 'status';

// Paths
const API_DELEGATIONS_BASE_PATH = `${API_SEGMENT}/${API_VERSION_SEGMENT}`;
const API_DELEGATIONS_MANDATE_BASE_PATH = `${API_SEGMENT}/${API_VERSION_SEGMENT}/${API_DELEGATIONS_MANDATE}`;
const API_DELEGATIONS_COUNT_BY_DELEGATE_PATH = `${API_DELEGATIONS_BASE_PATH}/${API_DELEGATIONS_COUNT_BY_DELEGATE}`;

// APIs
export function CREATE_DELEGATION() {
  return compileRoute({
    prefix: API_DELEGATIONS_PREFIX,
    path: API_DELEGATIONS_MANDATE_BASE_PATH,
  });
}

export function COUNT_DELEGATORS(status: DelegationStatus | Array<DelegationStatus>) {
  return compileRoute({
    prefix: API_DELEGATIONS_PREFIX,
    path: API_DELEGATIONS_COUNT_BY_DELEGATE_PATH,
    query: {
      [API_DELEGATIONS_STATUS_PARAMETER]: status,
    },
  });
}

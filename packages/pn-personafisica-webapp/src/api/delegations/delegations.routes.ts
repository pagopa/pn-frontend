import { compileRoute } from '@pagopa-pn/pn-commons';

// Prefixes
const API_DELEGATIONS_PREFIX = 'mandate';

// Segments
const API_SEGMENT = 'api';
const API_VERSION_SEGMENT = 'v1';
const API_DELEGATIONS_MANDATES_BY_DELEGATOR = 'mandates-by-delegator';
const API_DELEGATIONS_MANDATES_BY_DELEGATE = 'mandates-by-delegate';
const API_DELEGATIONS_MANDATE = 'mandate';
const API_DELEGATIONS_REVOKE = 'revoke';
const API_DELEGATIONS_REJECT = 'reject';
const API_DELEGATIONS_ACCEPT = 'accept';

// Parameters
const API_DELEGATIONS_ID_PARAMETER = 'id';

// Paths
const API_DELEGATIONS_BASE_PATH = `${API_SEGMENT}/${API_VERSION_SEGMENT}`;
const API_DELEGATIONS_MANDATES_BY_DELEGATOR_PATH = `${API_DELEGATIONS_BASE_PATH}/${API_DELEGATIONS_MANDATES_BY_DELEGATOR}`;
const API_DELEGATIONS_MANDATES_BY_DELEGATE_PATH = `${API_DELEGATIONS_BASE_PATH}/${API_DELEGATIONS_MANDATES_BY_DELEGATE}`;
const API_DELEGATIONS_MANDATE_BASE_PATH = `${API_SEGMENT}/${API_VERSION_SEGMENT}/${API_DELEGATIONS_MANDATE}`;
const API_DELEGATIONS_MANDATE_REVOKE_PATH = `${API_DELEGATIONS_MANDATE_BASE_PATH}/:${API_DELEGATIONS_ID_PARAMETER}/${API_DELEGATIONS_REVOKE}`;
const API_DELEGATIONS_MANDATE_REJECT_PATH = `${API_DELEGATIONS_MANDATE_BASE_PATH}/:${API_DELEGATIONS_ID_PARAMETER}/${API_DELEGATIONS_REJECT}`;
const API_DELEGATIONS_MANDATE_ACCEPT_PATH = `${API_DELEGATIONS_MANDATE_BASE_PATH}/:${API_DELEGATIONS_ID_PARAMETER}/${API_DELEGATIONS_ACCEPT}`;

// APIs
export function DELEGATIONS_BY_DELEGATOR() {
  return compileRoute({
    prefix: API_DELEGATIONS_PREFIX,
    path: API_DELEGATIONS_MANDATES_BY_DELEGATOR_PATH,
  });
}

export function DELEGATIONS_BY_DELEGATE() {
  return compileRoute({
    prefix: API_DELEGATIONS_PREFIX,
    path: API_DELEGATIONS_MANDATES_BY_DELEGATE_PATH,
  });
}

export function CREATE_DELEGATION() {
  return compileRoute({
    prefix: API_DELEGATIONS_PREFIX,
    path: API_DELEGATIONS_MANDATE_BASE_PATH,
  });
}

export function REVOKE_DELEGATION(id: string) {
  return compileRoute({
    prefix: API_DELEGATIONS_PREFIX,
    path: API_DELEGATIONS_MANDATE_REVOKE_PATH,
    params: {
      [API_DELEGATIONS_ID_PARAMETER]: id,
    },
  });
}

export function REJECT_DELEGATION(id: string) {
  return compileRoute({
    prefix: API_DELEGATIONS_PREFIX,
    path: API_DELEGATIONS_MANDATE_REJECT_PATH,
    params: {
      [API_DELEGATIONS_ID_PARAMETER]: id,
    },
  });
}

export function ACCEPT_DELEGATION(id: string) {
  return compileRoute({
    prefix: API_DELEGATIONS_PREFIX,
    path: API_DELEGATIONS_MANDATE_ACCEPT_PATH,
    params: {
      [API_DELEGATIONS_ID_PARAMETER]: id,
    },
  });
}

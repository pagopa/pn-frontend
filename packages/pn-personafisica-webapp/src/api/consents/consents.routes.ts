import {
  compileRoute,
} from '@pagopa-pn/pn-commons';

import { ConsentType } from '../../models/consents';

// Prefixes
const API_CONSENTS_PREFIX = 'user-consents';

// Segments
const API_VERSION_SEGMENT = 'v1';
const API_CONSENTS_BASE = 'consents';

// Parameters
const API_CONSENTS_TYPE_PARAMETER = 'consentType';

// Paths
const API_CONSENTS_BASE_PATH = `${API_VERSION_SEGMENT}/${API_CONSENTS_BASE}/:${API_CONSENTS_TYPE_PARAMETER}`;

// APIs
export function GET_CONSENTS(consentType: ConsentType) {
  return compileRoute({
    prefix: API_CONSENTS_PREFIX,
    path: API_CONSENTS_BASE_PATH,
    params: {
      [API_CONSENTS_TYPE_PARAMETER]: consentType
    },
  });
}

export function SET_CONSENTS(consentType: ConsentType, consentVersion: string) {
  return compileRoute({
    prefix: API_CONSENTS_PREFIX,
    path: API_CONSENTS_BASE_PATH,
    params: {
      [API_CONSENTS_TYPE_PARAMETER]: consentType
    },
    query: {
      version: consentVersion,
    },
  });
}

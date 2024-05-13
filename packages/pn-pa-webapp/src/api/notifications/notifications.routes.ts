import { compileRoute } from '@pagopa-pn/pn-commons';

import { GroupStatus } from './../../models/user';

// Prefixes
const API_DELIVERY_PREFIX = 'delivery';
const API_EXTERNAL_REGISTRY_PREFIX = 'ext-registry';

// Segments
const API_NOTIFICATIONS_ATTACHMENTS = 'attachments';
const API_NOTIFICATIONS_PRELOAD = 'preload';
const API_NOTIFICATIONS_REQUESTS = 'requests';
const API_NOTIFICATIONS_PA = 'pa';
const API_VERSION_SEGMENT = 'v1';
const API_VERSION_SEGMENT_2_3 = 'v2.3';
const API_NOTIFICATIONS_GROUPS = 'groups';

// Parameters
const API_NOTIFICATIONS_STATUS_FILTER_PARAMETER = 'statusFilter';

// Paths
const API_NOTIFICATION_USER_GROUPS_PATH = `${API_NOTIFICATIONS_GROUPS}`;
const API_NOTIFICATION_PRELOAD_DOCUMENT_PATH = `${API_NOTIFICATIONS_ATTACHMENTS}/${API_NOTIFICATIONS_PRELOAD}`;

// APIs
export function GET_USER_GROUPS(status?: GroupStatus) {
  return compileRoute({
    prefix: `${API_EXTERNAL_REGISTRY_PREFIX}/${API_NOTIFICATIONS_PA}`,
    version: API_VERSION_SEGMENT,
    path: API_NOTIFICATION_USER_GROUPS_PATH,
    query: {
      [API_NOTIFICATIONS_STATUS_FILTER_PARAMETER]: status ?? '',
    },
  });
}

export function NOTIFICATION_PRELOAD_DOCUMENT() {
  return compileRoute({
    prefix: API_DELIVERY_PREFIX,
    path: API_NOTIFICATION_PRELOAD_DOCUMENT_PATH,
  });
}

export function CREATE_NOTIFICATION() {
  return compileRoute({
    prefix: API_DELIVERY_PREFIX,
    version: API_VERSION_SEGMENT_2_3,
    path: API_NOTIFICATIONS_REQUESTS,
  });
}

import { compileRoute } from '@pagopa-pn/pn-commons';

// Prefixes
const API_DELIVERY_PREFIX = 'delivery';

// Segments
const API_NOTIFICATIONS_ATTACHMENTS = 'attachments';
const API_NOTIFICATIONS_PRELOAD = 'preload';
const API_NOTIFICATIONS_REQUESTS = 'requests';
const API_VERSION_SEGMENT_2_3 = 'v2.3';

// Paths
const API_NOTIFICATION_PRELOAD_DOCUMENT_PATH = `${API_NOTIFICATIONS_ATTACHMENTS}/${API_NOTIFICATIONS_PRELOAD}`;

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

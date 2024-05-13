import { compileRoute } from '@pagopa-pn/pn-commons';

// Prefixes
const API_DELIVERY_PREFIX = 'delivery';

// Segments
const API_NOTIFICATIONS_BASE = 'notifications';
const API_NOTIFICATIONS_RECEIVED = 'received';
const API_NOTIFICATIONS_FROM_QRCODE = 'check-aar-qr-code';

// Paths
const API_NOTIFICATION_ID_FROM_QRCODE_PATH = `${API_NOTIFICATIONS_BASE}/${API_NOTIFICATIONS_RECEIVED}/${API_NOTIFICATIONS_FROM_QRCODE}`;
// APIs
export function NOTIFICATION_ID_FROM_QRCODE() {
  return compileRoute({
    prefix: API_DELIVERY_PREFIX,
    path: API_NOTIFICATION_ID_FROM_QRCODE_PATH,
  });
}

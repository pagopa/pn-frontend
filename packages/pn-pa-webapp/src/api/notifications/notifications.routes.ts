import _ from 'lodash';

import { compileRoute } from '@pagopa-pn/pn-commons';

import { GroupStatus } from './../../models/user';

// Prefixes
const API_DELIVERY_PREFIX = 'delivery';
const API_EXTERNAL_REGISTRY_PREFIX = 'ext-registry';

// Segments
const API_NOTIFICATIONS_BASE = 'notifications';
const API_NOTIFICATIONS_SENT = 'sent';
const API_NOTIFICATIONS_ATTACHMENTS = 'attachments';
const API_NOTIFICATIONS_PRELOAD = 'preload';
const API_NOTIFICATIONS_REQUESTS = 'requests';
const API_NOTIFICATIONS_PA = 'pa';
const API_VERSION_SEGMENT = 'v1';
const API_VERSION_SEGMENT_2_3 = 'v2.3';
const API_NOTIFICATIONS_GROUPS = 'groups';
const API_NOTIFICATIONS_PAYMENT = 'payment';

// Parameters
const API_NOTIFICATIONS_IUN_PARAMETER = 'iun';
const API_NOTIFICATIONS_STATUS_FILTER_PARAMETER = 'statusFilter';
const API_NOTIFICATIONS_ATTACHMENT_NAME_PARAMETER = 'attachmentName';
const API_NOTIFICATIONS_ATTACHMENT_IDX_PARAMETER = 'attachmentIdx';
const API_NOTIFICATIONS_RECIPIENT_INDEX_PARAMETER = 'recipientIdx';

// Paths
const API_NOTIFICATIONS_SENT_PATH = `${API_NOTIFICATIONS_BASE}/${API_NOTIFICATIONS_SENT}`;
const API_NOTIFICATION_USER_GROUPS_PATH = `${API_NOTIFICATIONS_GROUPS}`;
const API_NOTIFICATION_PRELOAD_DOCUMENT_PATH = `${API_NOTIFICATIONS_ATTACHMENTS}/${API_NOTIFICATIONS_PRELOAD}`;
const API_NOTIFICATION_PAYMENT_ATTACHMENT_PATH = `${API_NOTIFICATIONS_SENT_PATH}/:${API_NOTIFICATIONS_IUN_PARAMETER}/${API_NOTIFICATIONS_ATTACHMENTS}/${API_NOTIFICATIONS_PAYMENT}/:${API_NOTIFICATIONS_RECIPIENT_INDEX_PARAMETER}/:${API_NOTIFICATIONS_ATTACHMENT_NAME_PARAMETER}`;

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

export function NOTIFICATION_PAYMENT_ATTACHMENT(
  iun: string,
  attachmentName: string,
  recIndex: number,
  attachmentIdx?: number
) {
  return compileRoute({
    prefix: API_DELIVERY_PREFIX,
    path: API_NOTIFICATION_PAYMENT_ATTACHMENT_PATH,
    params: {
      [API_NOTIFICATIONS_IUN_PARAMETER]: iun,
      [API_NOTIFICATIONS_ATTACHMENT_NAME_PARAMETER]: attachmentName,
      [API_NOTIFICATIONS_RECIPIENT_INDEX_PARAMETER]: recIndex.toString(),
    },
    query: {
      [API_NOTIFICATIONS_ATTACHMENT_IDX_PARAMETER]: !_.isNil(attachmentIdx)
        ? attachmentIdx.toString()
        : '',
    },
  });
}

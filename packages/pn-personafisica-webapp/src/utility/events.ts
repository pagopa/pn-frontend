import { EventsType } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../models/PFEventsType';

export enum TrackEventType {}
// SEND_PAYMENT_STATUS = 'SEND_PAYMENT_STATUS',
// SEND_PAYMENT_DETAIL_ERROR = 'SEND_PAYMENT_DETAIL_ERROR',
// SEND_CANCELLED_NOTIFICATION_REFOUND_INFO = 'SEND_CANCELLED_NOTIFICATION_REFOUND_INFO',
// SEND_MULTIPAYMENT_MORE_INFO = 'SEND_MULTIPAYMENT_MORE_INFO',
// SEND_PAYMENT_LIST_CHANGE_PAGE = 'SEND_PAYMENT_LIST_CHANGE_PAGE',
// SEND_F24_DOWNLOAD = 'SEND_F24_DOWNLOAD',
// SEND_F24_DOWNLOAD_SUCCESS = 'SEND_F24_DOWNLOAD_SUCCESS',
// SEND_DOWNLOAD_PAYMENT_NOTICE = 'SEND_DOWNLOAD_PAYMENT_NOTICE',
// SEND_F24_DOWNLOAD_TIMEOUT = 'SEND_F24_DOWNLOAD_TIMEOUT',
// SEND_DOWNLOAD_RESPONSE = 'SEND_DOWNLOAD_RESPONSE',

export const events: EventsType = {
  // [TrackEventType.SEND_PAYMENT_STATUS]: {
  //   event_category: EventCategory.TECH,
  // },
  // [TrackEventType.SEND_PAYMENT_DETAIL_ERROR]: {
  //   event_category: EventCategory.KO,
  // },
  // [TrackEventType.SEND_CANCELLED_NOTIFICATION_REFOUND_INFO]: {
  //   event_category: EventCategory.UX,
  //   event_type: EventAction.ACTION,
  // },
  // [TrackEventType.SEND_MULTIPAYMENT_MORE_INFO]: {
  //   event_category: EventCategory.UX,
  //   event_type: EventAction.ACTION,
  // },
  // [TrackEventType.SEND_PAYMENT_LIST_CHANGE_PAGE]: {
  //   event_category: EventCategory.UX,
  //   event_type: EventAction.ACTION,
  // },
  // [TrackEventType.SEND_F24_DOWNLOAD]: {
  //   event_category: EventCategory.UX,
  //   event_type: EventAction.ACTION,
  // },
  // [TrackEventType.SEND_F24_DOWNLOAD_SUCCESS]: {
  //   event_category: EventCategory.TECH,
  // },
  // [TrackEventType.SEND_DOWNLOAD_PAYMENT_NOTICE]: {
  //   event_category: EventCategory.UX,
  //   event_type: EventAction.ACTION,
  // },
  // [TrackEventType.SEND_F24_DOWNLOAD_TIMEOUT]: {
  //   event_category: EventCategory.TECH,
  // },
  // [TrackEventType.SEND_DOWNLOAD_RESPONSE]: {
  //   event_category: EventCategory.TECH,
  //   getAttributes(payload: {
  //     url: string;
  //     retryAfter?: number;
  //     docType?: string;
  //   }): Record<string, string> {
  //     return {
  //       doc_type: payload.docType ? payload.docType : '',
  //       url_available: payload.url ? 'ready' : 'retry_after',
  //     };
  //   },
  // },
};

export const eventsActionsMap: Record<string, PFEventsType> = {
  'getReceivedNotificationOtherDocument/fulfilled': PFEventsType.SEND_DOWNLOAD_RESPONSE,
  'getReceivedNotificationLegalfact/fulfilled': PFEventsType.SEND_DOWNLOAD_RESPONSE,
  'exchangeToken/fulfilled': PFEventsType.SEND_AUTH_SUCCESS,
};

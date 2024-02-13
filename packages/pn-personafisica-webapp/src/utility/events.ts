import { EventAction, EventCategory, EventsType, PaymentStatus } from '@pagopa-pn/pn-commons';

export enum TrackEventType {
  SEND_VIEW_PROFILE = 'SEND_VIEW_PROFILE',
  SEND_PROFILE = 'SEND_PROFILE',
  SEND_VIEW_CONTACT_DETAILS = 'SEND_VIEW_CONTACT_DETAILS',
  SEND_YOUR_NOTIFICATION = 'SEND_YOUR_NOTIFICATION',
  SEND_NOTIFICATION_DELEGATED = 'SEND_NOTIFICATION_DELEGATED',
  SEND_NOTIFICATION_DETAIL = 'SEND_NOTIFICATION_DETAIL',
  SEND_PAYMENT_STATUS = 'SEND_PAYMENT_STATUS',
  SEND_PAYMENT_DETAIL_ERROR = 'SEND_PAYMENT_DETAIL_ERROR',
  SEND_PAYMENT_DETAIL_REFRESH = 'SEND_PAYMENT_DETAIL_REFRESH',
  SEND_CANCELLED_NOTIFICATION_REFOUND_INFO = 'SEND_CANCELLED_NOTIFICATION_REFOUND_INFO',
  SEND_MULTIPAYMENT_MORE_INFO = 'SEND_MULTIPAYMENT_MORE_INFO',
  SEND_PAYMENT_LIST_CHANGE_PAGE = 'SEND_PAYMENT_LIST_CHANGE_PAGE',
  SEND_F24_DOWNLOAD = 'SEND_F24_DOWNLOAD',
  SEND_F24_DOWNLOAD_SUCCESS = 'SEND_F24_DOWNLOAD_SUCCESS',
  SEND_DOWNLOAD_ATTACHMENT = 'SEND_DOWNLOAD_ATTACHMENT',
  SEND_DOWNLOAD_RECEIPT_NOTICE = 'SEND_DOWNLOAD_RECEIPT_NOTICE',
  SEND_DOWNLOAD_CERTIFICATE_OPPOSABLE_TO_THIRD_PARTIES = 'SEND_DOWNLOAD_CERTIFICATE_OPPOSABLE_TO_THIRD_PARTIES',
  SEND_DOWNLOAD_PAYMENT_NOTICE = 'SEND_DOWNLOAD_PAYMENT_NOTICE',
  SEND_START_PAYMENT = 'SEND_START_PAYMENT',
  SEND_NOTIFICATION_STATUS_DETAIL = 'SEND_NOTIFICATION_STATUS_DETAIL',
  SEND_YOUR_MANDATES = 'SEND_YOUR_MANDATES',
  SEND_ADD_MANDATE_START = 'SEND_ADD_MANDATE_START',
  SEND_ADD_MANDATE_BACK = 'SEND_ADD_MANDATE_BACK',
  SEND_ADD_MANDATE_DATA_INPUT = 'SEND_ADD_MANDATE_DATA_INPUT',
  SEND_ADD_MANDATE_UX_CONVERSION = 'SEND_ADD_MANDATE_UX_CONVERSION',
  SEND_ADD_MANDATE_UX_SUCCESS = 'SEND_ADD_MANDATE_UX_SUCCESS',
  SEND_SHOW_MANDATE_CODE = 'SEND_SHOW_MANDATE_CODE',
  SEND_MANDATE_REVOKED = 'SEND_MANDATE_REVOKED',
  SEND_MANDATE_REJECTED = 'SEND_MANDATE_REJECTED',
  SEND_MANDATE_ACCEPTED = 'SEND_MANDATE_ACCEPTED',
  SEND_MANDATE_ACCEPT_CODE_ERROR = 'SEND_MANDATE_ACCEPT_CODE_ERROR',
  SEND_YOUR_CONTACT_DETAILS = 'SEND_YOUR_CONTACT_DETAILS',
  SEND_ADD_PEC_START = 'SEND_ADD_PEC_START',
  SEND_ADD_PEC_UX_CONVERSION = 'SEND_ADD_PEC_UX_CONVERSION',
  SEND_ADD_PEC_CODE_ERROR = 'SEND_ADD_PEC_CODE_ERROR',
  SEND_ADD_PEC_UX_SUCCESS = 'SEND_ADD_PEC_UX_SUCCESS',
  SEND_ACTIVE_IO_START = 'SEND_ACTIVE_IO_START',
  SEND_ACTIVE_IO_UX_CONVERSION = 'SEND_ACTIVE_IO_UX_CONVERSION',
  SEND_ACTIVE_IO_UX_SUCCESS = 'SEND_ACTIVE_IO_UX_SUCCESS',
  SEND_DEACTIVE_IO_START = 'SEND_DEACTIVE_IO_START',
  SEND_DEACTIVE_IO_UX_CONVERSION = 'SEND_DEACTIVE_IO_UX_CONVERSION',
  SEND_DEACTIVE_IO_UX_SUCCESS = 'SEND_DEACTIVE_IO_UX_SUCCESS',
  SEND_ADD_SMS_START = 'SEND_ADD_SMS_START',
  SEND_ADD_SMS_UX_CONVERSION = 'SEND_ADD_SMS_UX_CONVERSION',
  SEND_ADD_SMS_CODE_ERROR = 'SEND_ADD_SMS_CODE_ERROR',
  SEND_ADD_SMS_UX_SUCCESS = 'SEND_ADD_SMS_UX_SUCCESS',
  SEND_ADD_EMAIL_START = 'SEND_ADD_EMAIL_START',
  SEND_ADD_EMAIL_UX_CONVERSION = 'SEND_ADD_EMAIL_UX_CONVERSION',
  SEND_ADD_EMAIL_CODE_ERROR = 'SEND_ADD_EMAIL_CODE_ERROR',
  SEND_ADD_EMAIL_UX_SUCCESS = 'SEND_ADD_EMAIL_UX_SUCCESS',
  SEND_SERVICE_STATUS = 'SEND_SERVICE_STATUS',
  SEND_REFRESH_PAGE = 'SEND_REFRESH_PAGE',
  SEND_TOAST_ERROR = 'SEND_TOAST_ERROR',
  SEND_GENERIC_ERROR = 'SEND_GENERIC_ERROR',
  SEND_F24_DOWNLOAD_TIMEOUT = 'SEND_F24_DOWNLOAD_TIMEOUT',
  SEND_DOWNLOAD_RESPONSE = 'SEND_DOWNLOAD_RESPONSE',
  SEND_PAYMENT_OUTCOME = 'SEND_PAYMENT_OUTCOME',
  SEND_AUTH_SUCCESS = 'SEND_AUTH_SUCCESS',
  SEND_NOTIFICATION_NOT_ALLOWED = 'SEND_NOTIFICATION_NOT_ALLOWED' 
}

export const events: EventsType = {
  [TrackEventType.SEND_VIEW_PROFILE]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_PROFILE]: {
    event_category: EventCategory.UX,
    event_type: EventAction.SCREEN_VIEW,
  },
  [TrackEventType.SEND_VIEW_CONTACT_DETAILS]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_YOUR_NOTIFICATION]: {
    event_category: EventCategory.UX,
    event_type: EventAction.SCREEN_VIEW,
  },
  [TrackEventType.SEND_NOTIFICATION_DELEGATED]: {
    event_category: EventCategory.UX,
    event_type: EventAction.SCREEN_VIEW,
  },
  [TrackEventType.SEND_NOTIFICATION_DETAIL]: {
    event_category: EventCategory.UX,
    event_type: EventAction.SCREEN_VIEW,
  },
  [TrackEventType.SEND_PAYMENT_STATUS]: {
    event_category: EventCategory.TECH,
  },
  [TrackEventType.SEND_PAYMENT_DETAIL_ERROR]: {
    event_category: EventCategory.KO,
  },
  [TrackEventType.SEND_PAYMENT_DETAIL_REFRESH]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_CANCELLED_NOTIFICATION_REFOUND_INFO]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_MULTIPAYMENT_MORE_INFO]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_PAYMENT_LIST_CHANGE_PAGE]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_F24_DOWNLOAD]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_F24_DOWNLOAD_SUCCESS]: {
    event_category: EventCategory.TECH,
  },
  [TrackEventType.SEND_DOWNLOAD_ATTACHMENT]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_DOWNLOAD_RECEIPT_NOTICE]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_DOWNLOAD_CERTIFICATE_OPPOSABLE_TO_THIRD_PARTIES]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_DOWNLOAD_PAYMENT_NOTICE]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_START_PAYMENT]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_NOTIFICATION_STATUS_DETAIL]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_YOUR_MANDATES]: {
    event_category: EventCategory.UX,
    event_type: EventAction.SCREEN_VIEW,
  },
  [TrackEventType.SEND_ADD_MANDATE_START]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_ADD_MANDATE_BACK]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_ADD_MANDATE_DATA_INPUT]: {
    event_category: EventCategory.UX,
    event_type: EventAction.SCREEN_VIEW,
  },
  [TrackEventType.SEND_ADD_MANDATE_UX_CONVERSION]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_ADD_MANDATE_UX_SUCCESS]: {
    event_category: EventCategory.UX,
    event_type: EventAction.SCREEN_VIEW,
  },
  [TrackEventType.SEND_SHOW_MANDATE_CODE]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_MANDATE_REVOKED]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_MANDATE_REJECTED]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_MANDATE_ACCEPTED]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_MANDATE_ACCEPT_CODE_ERROR]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ERROR,
  },
  [TrackEventType.SEND_YOUR_CONTACT_DETAILS]: {
    event_category: EventCategory.UX,
    event_type: EventAction.SCREEN_VIEW,
  },
  [TrackEventType.SEND_ADD_PEC_START]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_ADD_PEC_UX_CONVERSION]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_ADD_PEC_CODE_ERROR]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ERROR,
  },
  [TrackEventType.SEND_ADD_PEC_UX_SUCCESS]: {
    event_category: EventCategory.UX,
    event_type: EventAction.SCREEN_VIEW,
  },
  [TrackEventType.SEND_ACTIVE_IO_START]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_ACTIVE_IO_UX_CONVERSION]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_ACTIVE_IO_UX_SUCCESS]: {
    event_category: EventCategory.UX,
    event_type: EventAction.SCREEN_VIEW,
  },
  [TrackEventType.SEND_DEACTIVE_IO_START]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_DEACTIVE_IO_UX_CONVERSION]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_DEACTIVE_IO_UX_SUCCESS]: {
    event_category: EventCategory.UX,
    event_type: EventAction.SCREEN_VIEW,
  },
  [TrackEventType.SEND_ADD_SMS_START]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_ADD_SMS_UX_CONVERSION]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_ADD_SMS_CODE_ERROR]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ERROR,
  },
  [TrackEventType.SEND_ADD_SMS_UX_SUCCESS]: {
    event_category: EventCategory.UX,
    event_type: EventAction.SCREEN_VIEW,
  },
  [TrackEventType.SEND_ADD_EMAIL_START]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_ADD_EMAIL_UX_CONVERSION]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_ADD_EMAIL_CODE_ERROR]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ERROR,
  },
  [TrackEventType.SEND_ADD_EMAIL_UX_SUCCESS]: {
    event_category: EventCategory.UX,
    event_type: EventAction.SCREEN_VIEW,
  },
  [TrackEventType.SEND_SERVICE_STATUS]: {
    event_category: EventCategory.UX,
    event_type: EventAction.SCREEN_VIEW,
  },
  [TrackEventType.SEND_REFRESH_PAGE]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_TOAST_ERROR]: {
    event_category: EventCategory.KO,
  },
  [TrackEventType.SEND_GENERIC_ERROR]: {
    event_category: EventCategory.KO,
  },
  [TrackEventType.SEND_F24_DOWNLOAD_TIMEOUT]: {
    event_category: EventCategory.TECH,
  },
  [TrackEventType.SEND_DOWNLOAD_RESPONSE]: {
    event_category: EventCategory.TECH,
    getAttributes(payload: {
      url: string;
      retryAfter?: number;
      docType?: string;
    }): Record<string, string> {
      return {
        doc_type: payload.docType ? payload.docType : '',
        url_available: payload.url ? 'ready' : 'retry_after',
      };
    },
  },
  [TrackEventType.SEND_PAYMENT_OUTCOME]: {
    event_category: EventCategory.TECH,
    getAttributes(payload: { outcome: PaymentStatus }): Record<string, string> {
      return {
        outcome: payload.outcome,
      };
    },
  },
  [TrackEventType.SEND_AUTH_SUCCESS]: {
    event_category: EventCategory.TECH
  },
  [TrackEventType.SEND_NOTIFICATION_NOT_ALLOWED]: {
    event_category: EventCategory.TECH,
    event_type: EventAction.SCREEN_VIEW
  }
};

export const eventsActionsMap: Record<string, TrackEventType> = {
  'getReceivedNotificationOtherDocument/fulfilled': TrackEventType.SEND_DOWNLOAD_RESPONSE,
  'getReceivedNotificationLegalfact/fulfilled': TrackEventType.SEND_DOWNLOAD_RESPONSE,
};

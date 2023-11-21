import { EventsType } from '@pagopa-pn/pn-commons';

// All the events are been removed by request of PN-8114 because will be filled again by PN-7437.
// I added a temporary "PLACEHOLDER" to prevent mixpanel errors in mixpanel.ts
// Remove PLACEHOLDER when PN-7437 stars.

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
  SEND_EDIT_MANDATE = 'SEND_EDIT_MANDATE',
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
}

export const events: EventsType = {
  [TrackEventType.SEND_VIEW_PROFILE]: {
    category: 'UX',
    action: 'click on view user data',
  },
  [TrackEventType.SEND_PROFILE]: {
    category: 'UX',
    action: 'view user data',
  },
  [TrackEventType.SEND_VIEW_CONTACT_DETAILS]: {
    category: 'UX',
    action: 'click on go contacts page',
  },
  [TrackEventType.SEND_YOUR_NOTIFICATION]: {
    category: 'UX',
    action: 'view notifications page',
  },
  [TrackEventType.SEND_NOTIFICATION_DELEGATED]: {
    category: 'UX',
    action: 'view notifications page as delegate',
  },
  [TrackEventType.SEND_NOTIFICATION_DETAIL]: {
    category: 'UX',
    action: 'view notification detail page',
  },
  [TrackEventType.SEND_PAYMENT_STATUS]: {
    category: 'TECH',
    action: 'view payment status in notification detail page',
  },
  [TrackEventType.SEND_PAYMENT_DETAIL_ERROR]: {
    category: 'KO',
    action: 'failed to load payment status in notification detail page',
  },
  [TrackEventType.SEND_PAYMENT_DETAIL_REFRESH]: {
    category: 'UX',
    action: 'click on reload payment status',
  },
  [TrackEventType.SEND_CANCELLED_NOTIFICATION_REFOUND_INFO]: {
    category: 'UX',
    action: 'click on more info',
  },
  [TrackEventType.SEND_MULTIPAYMENT_MORE_INFO]: {
    category: 'UX',
    action: 'click on more info in multipayment status',
  },
  [TrackEventType.SEND_PAYMENT_LIST_CHANGE_PAGE]: {
    category: 'UX',
    action: 'click on change page or size in payment list',
  },
  [TrackEventType.SEND_F24_DOWNLOAD]: {
    category: 'UX',
    action: 'click on download F24 document',
  },
  [TrackEventType.SEND_F24_DOWNLOAD_SUCCESS]: {
    category: 'TECH',
    action: 'download F24 document success',
  },
  [TrackEventType.SEND_DOWNLOAD_ATTACHMENT]: {
    category: 'UX',
    action: 'click on download attached document',
  },
  [TrackEventType.SEND_DOWNLOAD_RECEIPT_NOTICE]: {
    category: 'UX',
    action: 'click on download recepit notice',
  },
  [TrackEventType.SEND_DOWNLOAD_CERTIFICATE_OPPOSABLE_TO_THIRD_PARTIES]: {
    category: 'UX',
    action: 'click on download certificate opposable to 3rd parties',
  },
  [TrackEventType.SEND_DOWNLOAD_PAYMENT_NOTICE]: {
    category: 'UX',
    action: 'click on download payment notice',
  },
  [TrackEventType.SEND_START_PAYMENT]: {
    category: 'UX',
    action: 'click on pay in detailed notification',
  },
  [TrackEventType.SEND_NOTIFICATION_STATUS_DETAIL]: {
    category: 'UX',
    action: 'click on accordion status details',
  },
  [TrackEventType.SEND_YOUR_MANDATES]: {
    category: 'UX',
    action: 'view delegates page',
  },
  [TrackEventType.SEND_ADD_MANDATE_START]: {
    category: 'UX',
    action: 'click on add delegation',
  },
  [TrackEventType.SEND_ADD_MANDATE_BACK]: {
    category: 'UX',
    action: 'click on back button in add new delegation page',
  },
  [TrackEventType.SEND_ADD_MANDATE_DATA_INPUT]: {
    category: 'UX',
    action: 'view add new delegation page',
  },
  [TrackEventType.SEND_ADD_MANDATE_UX_CONVERSION]: {
    category: 'UX',
    action: 'click on submit button in add new delegation page',
  },
  [TrackEventType.SEND_ADD_MANDATE_UX_SUCCESS]: {
    category: 'UX',
    action: 'view add new delegation success page',
  },
  [TrackEventType.SEND_SHOW_MANDATE_CODE]: {
    category: 'UX',
    action: 'click on show otp code of delegation',
  },
  [TrackEventType.SEND_EDIT_MANDATE]: {
    category: 'UX',
    action: 'click on edit delegation',
  },
  [TrackEventType.SEND_MANDATE_REVOKED]: {
    category: 'UX',
    action: 'click on revoke delegation',
  },
  [TrackEventType.SEND_MANDATE_REJECTED]: {
    category: 'UX',
    action: 'click on reject delegation',
  },
  [TrackEventType.SEND_MANDATE_ACCEPTED]: {
    category: 'UX',
    action: 'click on accept delegation',
  },
  [TrackEventType.SEND_MANDATE_ACCEPT_CODE_ERROR]: {
    category: 'UX',
    action: 'wrong delegation code',
  },
  [TrackEventType.SEND_YOUR_CONTACT_DETAILS]: {
    category: 'UX',
    action: 'view contacts page',
  },
  [TrackEventType.SEND_ADD_PEC_START]: {
    category: 'UX',
    action: 'click on confirm in pec card',
  },
  [TrackEventType.SEND_ADD_PEC_UX_CONVERSION]: {
    category: 'UX',
    action: 'click on confirm in pec otp code',
  },
  [TrackEventType.SEND_ADD_PEC_CODE_ERROR]: {
    category: 'UX',
    action: 'wrong pec otp code',
  },
  [TrackEventType.SEND_ADD_PEC_UX_SUCCESS]: {
    category: 'UX',
    action: 'pec added successfully',
  },
  [TrackEventType.SEND_ACTIVE_IO_START]: {
    category: 'UX',
    action: 'click on enable IO app',
  },
  [TrackEventType.SEND_ACTIVE_IO_UX_CONVERSION]: {
    category: 'UX',
    action: 'click on enable IO app modal',
  },
  [TrackEventType.SEND_ACTIVE_IO_UX_SUCCESS]: {
    category: 'UX',
    action: 'enable IO app successfully',
  },
  [TrackEventType.SEND_DEACTIVE_IO_START]: {
    category: 'UX',
    action: 'click on disable IO app',
  },
  [TrackEventType.SEND_DEACTIVE_IO_UX_CONVERSION]: {
    category: 'UX',
    action: 'click on disable IO app modal',
  },
  [TrackEventType.SEND_DEACTIVE_IO_UX_SUCCESS]: {
    category: 'UX',
    action: 'disable IO app successfully',
  },
  [TrackEventType.SEND_ADD_SMS_START]: {
    category: 'UX',
    action: 'click on confirm in sms card',
  },
  [TrackEventType.SEND_ADD_SMS_UX_CONVERSION]: {
    category: 'UX',
    action: 'click on confirm in sms otp code',
  },
  [TrackEventType.SEND_ADD_SMS_CODE_ERROR]: {
    category: 'UX',
    action: 'wrong sms otp code',
  },
  [TrackEventType.SEND_ADD_SMS_UX_SUCCESS]: {
    category: 'UX',
    action: 'sms added successfully',
  },
  [TrackEventType.SEND_ADD_EMAIL_START]: {
    category: 'UX',
    action: 'click on confirm in email card',
  },
  [TrackEventType.SEND_ADD_EMAIL_UX_CONVERSION]: {
    category: 'UX',
    action: 'click on confirm in email otp code',
  },
  [TrackEventType.SEND_ADD_EMAIL_CODE_ERROR]: {
    category: 'UX',
    action: 'wrong email otp code',
  },
  [TrackEventType.SEND_ADD_EMAIL_UX_SUCCESS]: {
    category: 'UX',
    action: 'email added successfully',
  },
  [TrackEventType.SEND_SERVICE_STATUS]: {
    category: 'UX',
    action: 'view platform status page',
  },
  [TrackEventType.SEND_REFRESH_PAGE]: {
    category: 'UX',
    action: 'click on refresh page',
  },
  [TrackEventType.SEND_TOAST_ERROR]: {
    category: 'KO',
    action: 'API error',
  },
  [TrackEventType.SEND_GENERIC_ERROR]: {
    category: 'KO',
    action: 'somewhat gone wrong',
  },
  [TrackEventType.SEND_F24_DOWNLOAD_TIMEOUT]: {
    category: 'TECH',
    action: 'timeout of F24 document download',
  },
};

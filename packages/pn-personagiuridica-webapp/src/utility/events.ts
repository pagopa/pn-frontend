import { EventsType } from '@pagopa-pn/pn-commons';

export enum TrackEventType {
  APP_CRASH = 'APP_CRASH',
  APP_UNLOAD = 'APP_UNLOAD',
  CONTACT_LEGAL_CONTACT = 'CONTACT_LEGAL_CONTACT',
  CONTACT_MAIL_COURTESY = 'CONTACT_MAIL_COURTESY',
  CONTACT_SPECIAL_CONTACTS = 'CONTACT_SPECIAL_CONTACTS',
  CONTACT_TEL_COURTESY = 'CONTACT_TEL_COURTESY',
  CUSTOMER_CARE_MAILTO = 'CUSTOMER_CARE_MAILTO',
  DELEGATION_DELEGATE_ADD_ACTION = 'DELEGATION_DELEGATE_ADD_ACTION',
  DELEGATION_DELEGATE_ADD_CTA = 'DELEGATION_DELEGATE_ADD_CTA',
  DELEGATION_DELEGATE_ADD_ERROR = 'delegationsSlice/createDelegation/rejected',
  DELEGATION_DELEGATE_REVOKE = 'DELEGATION_DELEGATE_REVOKE',
  DELEGATION_DELEGATE_VIEW_CODE = 'DELEGATION_DELEGATE_VIEW_CODE',
  DELEGATION_DELEGATOR_ACCEPT = 'delegationsSlice/openAcceptModal',
  DELEGATION_DELEGATOR_REJECT = 'DELEGATION_DELEGATOR_REJECT',
  DIGITAL_DOMICILE_BANNER_CLOSE = 'DIGITAL_DOMICILE_BANNER_CLOSE',
  DIGITAL_DOMICILE_LINK = 'DIGITAL_DOMICILE_LINK',
  NOTIFICATION_DETAIL_ALL_ATTACHMENTS = 'NOTIFICATION_DETAIL_ALL_ATTACHMENTS',
  NOTIFICATION_DETAIL_HELP_BOX = 'NOTIFICATION_DETAIL_HELP_BOX',
  NOTIFICATION_DETAIL_PAYMENT_ASSISTANCE = 'NOTIFICATION_DETAIL_PAYMENT_ASSISTANCE',
  NOTIFICATION_DETAIL_PAYMENT_INTERACTION = 'NOTIFICATION_DETAIL_PAYMENT_INTERACTION',
  NOTIFICATION_DETAIL_PAYMENT_ERROR = 'getNotificationPaymentInfo/rejected',
  NOTIFICATION_DETAIL_PAYMENT_F24_FILE = 'NOTIFICATION_DETAIL_PAYMENT_F24_FILE',
  NOTIFICATION_DETAIL_PAYMENT_PAGOPA_FILE = 'NOTIFICATION_DETAIL_PAYMENT_PAGOPA_FILE',
  NOTIFICATION_DETAIL_PAYMENT_RELOAD = 'NOTIFICATION_DETAIL_PAYMENT_RELOAD',
  NOTIFICATION_DETAIL_SINGLE_ATTACHMENT = 'getReceivedNotificationDocument/fulfilled',
  NOTIFICATION_FILTER_REMOVE = 'NOTIFICATION_FILTER_REMOVE',
  NOTIFICATION_FILTER_SEARCH = 'NOTIFICATION_FILTER_SEARCH',
  NOTIFICATION_TIMELINE_ALL_ATTACHMENTS = 'NOTIFICATION_TIMELINE_ALL_ATTACHMENTS',
  NOTIFICATION_TIMELINE_SINGLE_ATTACHMENT = 'getReceivedNotificationLegalfact/fulfilled',
  NOTIFICATION_TIMELINE_VIEW_MORE = 'NOTIFICATION_TIMELINE_VIEW_MORE',
  NOTIFICATION_TABLE_PAGINATION = 'NOTIFICATION_TABLE_PAGINATION',
  NOTIFICATION_TABLE_ROW_INTERACTION = 'NOTIFICATION_TABLE_ROW_INTERACTION',
  NOTIFICATION_TABLE_ROW_TOOLTIP = 'NOTIFICATION_TABLE_ROW_TOOLTIP',
  NOTIFICATION_TABLE_SIZE = 'NOTIFICATION_TABLE_SIZE',
  NOTIFICATION_TABLE_SORT = 'setSorting',
  USER_LOGOUT = 'logout/fulfilled',
  USER_NAV_ITEM = 'USER_NAV_ITEM',
  USER_PRODUCT_SWITCH = 'USER_PRODUCT_SWITCH',
  USER_VIEW_CONTACTS_PROFILE = 'USER_VIEW_CONTACTS_PROFILE',
  USER_VIEW_PROFILE = 'USER_VIEW_PROFILE',
}

export const events: EventsType = {
  [TrackEventType.APP_CRASH]: {
    event_category: 'app',
    event_type: 'app crashed',
  },
  [TrackEventType.APP_UNLOAD]: {
    event_category: 'app',
    event_type: 'app unloaded',
  },
  [TrackEventType.CONTACT_LEGAL_CONTACT]: {
    event_category: 'contact',
    event_type: 'edit legal contact',
  },
  [TrackEventType.CONTACT_MAIL_COURTESY]: {
    event_category: 'contact',
    event_type: 'edit email courtesy contact',
  },
  [TrackEventType.CONTACT_SPECIAL_CONTACTS]: {
    event_category: 'contact',
    event_type: 'edit special contact',
  },
  [TrackEventType.CONTACT_TEL_COURTESY]: {
    event_category: 'contact',
    event_type: 'edit telephone courtesy contact',
  },
  [TrackEventType.CUSTOMER_CARE_MAILTO]: {
    event_category: 'customer care',
    event_type: 'click on customer care email',
  },
  [TrackEventType.DELEGATION_DELEGATE_ADD_ACTION]: {
    event_category: 'delegation',
    event_type: 'add new delegate',
  },
  [TrackEventType.DELEGATION_DELEGATE_ADD_CTA]: {
    event_category: 'delegation',
    event_type: 'click/tap on the button that shows the new delegation form',
  },
  [TrackEventType.DELEGATION_DELEGATE_ADD_ERROR]: {
    event_category: 'delegation',
    event_type: 'error while adding new delegate',
    getAttributes: (payload: { [key: string]: any }) => ({
      type: payload.response.data.title || 'generic error',
    }),
  },
  [TrackEventType.DELEGATION_DELEGATE_REVOKE]: {
    event_category: 'delegation',
    event_type: 'click/tap on the revoke action',
  },
  [TrackEventType.DELEGATION_DELEGATE_VIEW_CODE]: {
    event_category: 'delegation',
    event_type: 'click/tap on show code',
  },
  [TrackEventType.DELEGATION_DELEGATOR_ACCEPT]: {
    event_category: 'delegation',
    event_type: 'click/tap on the accept button',
  },
  [TrackEventType.DELEGATION_DELEGATOR_REJECT]: {
    event_category: 'delegation',
    event_type: 'click/tap on reject action',
  },
  [TrackEventType.DIGITAL_DOMICILE_BANNER_CLOSE]: {
    event_category: 'notification',
    event_type: 'close the banner in notifications detail/list',
  },
  [TrackEventType.DIGITAL_DOMICILE_LINK]: {
    event_category: 'notification',
    event_type: 'click/tap on  the banner link in notifications detail/list',
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_ASSISTANCE]: {
    event_category: 'notification',
    event_type: 'contact assistance',
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_ERROR]: {
    event_category: 'notification',
    event_type: 'failed payment',
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_F24_FILE]: {
    event_category: 'notification',
    event_type: 'download the F24 file',
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_INTERACTION]: {
    event_category: 'notification',
    event_type: 'click on the pay button',
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_PAGOPA_FILE]: {
    event_category: 'notification',
    event_type: 'download the PagoPA file',
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_RELOAD]: {
    event_category: 'notification',
    event_type: 'reload the payment page',
  },
  [TrackEventType.NOTIFICATION_DETAIL_SINGLE_ATTACHMENT]: {
    event_category: 'notification',
    event_type: 'click/tap on  the banner link in notifications detail/list',
  },
  [TrackEventType.NOTIFICATION_FILTER_SEARCH]: {
    event_category: 'notification',
    event_type: 'click/tap on  the filter button in notifications filter',
  },
  [TrackEventType.NOTIFICATION_TABLE_PAGINATION]: {
    event_category: 'notification',
    event_type: 'change page',
  },
  [TrackEventType.NOTIFICATION_TABLE_ROW_INTERACTION]: {
    event_category: 'notification',
    event_type: 'go to notification detail',
  },
  [TrackEventType.NOTIFICATION_TABLE_SORT]: {
    event_category: 'notification',
    event_type: 'change notification sorting order',
    getAttributes: (payload: { [key: string]: string }) => ({
      orderBy: payload.orderBy,
      order: payload.order,
    }),
  },
  [TrackEventType.NOTIFICATION_TIMELINE_SINGLE_ATTACHMENT]: {
    event_category: 'notification',
    event_type: 'click/tap on  the banner link in notifications timeline',
  },
  [TrackEventType.NOTIFICATION_TIMELINE_VIEW_MORE]: {
    event_category: 'notification',
    event_type: 'click/tap on timeline view more',
  },
  [TrackEventType.USER_LOGOUT]: {
    event_category: 'user',
    event_type: 'user logs out from action',
  },
  [TrackEventType.USER_NAV_ITEM]: {
    event_category: 'user',
    event_type: 'click on a sidebar link',
  },
  [TrackEventType.USER_PRODUCT_SWITCH]: {
    event_category: 'user',
    event_type: 'switch product',
  },
  [TrackEventType.USER_VIEW_PROFILE]: {
    event_category: 'user',
    event_type: 'go to user profile',
  },
  [TrackEventType.USER_VIEW_CONTACTS_PROFILE]: {
    event_category: 'user',
    event_type: 'go to contacts from profile',
  },
};

export enum EventActions {
  ADD = 'add',
  EDIT = 'edit',
  DELETE = 'delete',
}

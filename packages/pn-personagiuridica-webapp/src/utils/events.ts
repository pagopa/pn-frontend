import { EventsType } from '@pagopa-pn/pn-commons';

export enum TrackEventType {
  APP_CRASH = 'APP_CRASH',
  APP_UNLOAD = 'APP_UNLOAD',
  CUSTOMER_CARE_MAILTO = 'CUSTOMER_CARE_MAILTO',
  FOOTER_LANG_SWITCH = 'FOOTER_LANG_SWITCH',
  USER_NAV_ITEM = 'USER_NAV_ITEM',
  USER_PRODUCT_SWITCH = 'USER_PRODUCT_SWITCH',
  USER_VIEW_PROFILE = 'USER_VIEW_PROFILE',
  NOTIFICATION_TIMELINE_VIEW_MORE = 'NOTIFICATION_TIMELINE_VIEW_MORE',
  DIGITAL_DOMICILE_BANNER_CLOSE = 'DIGITAL_DOMICILE_BANNER_CLOSE',
  DIGITAL_DOMICILE_LINK = 'DIGITAL_DOMICILE_LINK',
  NOTIFICATION_TABLE_ROW_TOOLTIP = 'NOTIFICATION_TABLE_ROW_TOOLTIP',
  NOTIFICATION_TABLE_ROW_INTERACTION = 'NOTIFICATION_TABLE_ROW_INTERACTION',
  NOTIFICATION_FILTER_REMOVE = 'NOTIFICATION_FILTER_REMOVE',
  NOTIFICATION_FILTER_SEARCH = 'NOTIFICATION_FILTER_SEARCH',
  NOTIFICATION_DETAIL_PAYMENT_INTERACTION = 'NOTIFICATION_DETAIL_PAYMENT_INTERACTION',
  NOTIFICATION_DETAIL_PAYMENT_ASSISTANCE = 'NOTIFICATION_DETAIL_PAYMENT_ASSISTANCE',
  NOTIFICATION_DETAIL_PAYMENT_F24_FILE = 'NOTIFICATION_DETAIL_PAYMENT_F24_FILE',
  NOTIFICATION_DETAIL_PAYMENT_PAGOPA_FILE = 'NOTIFICATION_DETAIL_PAYMENT_PAGOPA_FILE',
  NOTIFICATION_DETAIL_PAYMENT_RELOAD = 'NOTIFICATION_DETAIL_PAYMENT_RELOAD',
}

export const events: EventsType = {
  [TrackEventType.APP_CRASH]: {
    category: 'app',
    action: 'app crashed',
  },
  [TrackEventType.APP_UNLOAD]: {
    category: 'app',
    action: 'app unloaded',
  },
  [TrackEventType.CUSTOMER_CARE_MAILTO]: {
    category: 'customer care',
    action: 'click on customer care email',
  },
  [TrackEventType.USER_NAV_ITEM]: {
    category: 'user',
    action: 'click on a sidebar link',
  },
  [TrackEventType.USER_PRODUCT_SWITCH]: {
    category: 'user',
    action: 'switch product',
  },
  [TrackEventType.USER_VIEW_PROFILE]: {
    category: 'user',
    action: 'go to user profile',
  },
  [TrackEventType.DIGITAL_DOMICILE_BANNER_CLOSE]: {
    category: 'notification',
    action: 'close the banner in notifications detail/list',
  },
  [TrackEventType.DIGITAL_DOMICILE_LINK]: {
    category: 'notification',
    action: 'click/tap on  the banner link in notifications detail/list',
  },
  [TrackEventType.NOTIFICATION_TIMELINE_VIEW_MORE]: {
    category: 'notification',
    action: 'click/tap on timeline view more',
  },
  [TrackEventType.NOTIFICATION_TABLE_ROW_INTERACTION]: {
    category: 'notification',
    action: 'go to notification detail',
  },
  [TrackEventType.NOTIFICATION_FILTER_SEARCH]: {
    category: 'notification',
    action: 'click/tap on  the filter button in notifications filter',
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_INTERACTION]: {
    category: 'notification',
    action: 'click on the pay button',
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_ASSISTANCE]: {
    category: 'notification',
    action: 'contact assistance',
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_PAGOPA_FILE]: {
    category: 'notification',
    action: 'download the PagoPA file',
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_RELOAD]: {
    category: 'notification',
    action: 'reload the payment page',
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_F24_FILE]: {
    category: 'notification',
    action: 'download the F24 file',
  },
};

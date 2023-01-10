import { EventsType } from '@pagopa-pn/pn-commons';

export enum TrackEventType {
  APP_CRASH = 'APP_CRASH',
  APP_UNLOAD = 'APP_UNLOAD',
  CUSTOMER_CARE_MAILTO = 'CUSTOMER_CARE_MAILTO',
  FOOTER_LANG_SWITCH = 'FOOTER_LANG_SWITCH',
  USER_NAV_ITEM = 'USER_NAV_ITEM',
  USER_PRODUCT_SWITCH = 'USER_PRODUCT_SWITCH',
  USER_VIEW_PROFILE = 'USER_VIEW_PROFILE',
  CONTACT_MAIL_COURTESY = 'CONTACT_MAIL_COURTESY',
  CONTACT_IOAPP_COURTESY = 'CONTACT_IOAPP_COURTESY',
  CONTACT_TEL_COURTESY = 'CONTACT_TEL_COURTESY',
  CONTACT_LEGAL_CONTACT = 'CONTACT_LEGAL_CONTACT',
  CONTACT_SPECIAL_CONTACTS = 'CONTACT_SPECIAL_CONTACTS',
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
};
export enum EventActions {
  ADD = 'add',
  EDIT = 'edit',
  DELETE = 'delete',
}

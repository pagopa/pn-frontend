import { EventAction, EventCategory, EventsType } from '@pagopa-pn/pn-commons';

export enum TrackEventType {
  SEND_LOGIN = 'SEND_LOGIN',
  SEND_IDP_SELECTED = 'SEND_IDP_SELECTED',
  SEND_LOGIN_FAILURE = 'SEND_LOGIN_FAILURE',
}

export const events: EventsType = {
  [TrackEventType.SEND_LOGIN]: {
    event_category: EventCategory.UX,
    event_type: EventAction.SCREEN_VIEW,
  },
  [TrackEventType.SEND_IDP_SELECTED]: {
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
  },
  [TrackEventType.SEND_LOGIN_FAILURE]: {
    event_category: EventCategory.TECH,
  },
};

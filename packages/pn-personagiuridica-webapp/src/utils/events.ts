import { EventsType } from '@pagopa-pn/pn-commons';

export enum TrackEventType {
  APP_CRASH = 'APP_CRASH'
}

export const events: EventsType = {
  [TrackEventType.APP_CRASH]: {
    category: 'app',
    action: 'app crashed'
  },
};
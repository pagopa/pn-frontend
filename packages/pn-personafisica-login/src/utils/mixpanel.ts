import { trackEvent } from '@pagopa-pn/pn-commons';

import { events, TrackEventType } from './events';

/**
 * Function to track events outside redux
 * @param trackEventType event name
 * @param attributes event attributes
 */
export const trackEventByType = (trackEventType: TrackEventType, attributes?: object) => {
  const eventParameters = attributes
    ? { ...events[trackEventType], attributes: { ...attributes } }
    : events[trackEventType];

  trackEvent(trackEventType, process.env.NODE_ENV, eventParameters);
};

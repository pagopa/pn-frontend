import { interceptDispatch, trackEvent } from '@pagopa-pn/pn-commons';
import { AnyAction, Dispatch, Middleware } from '@reduxjs/toolkit';
import { events, TrackEventType } from './events';

/**
 * Redux middleware to track events
 */
export const trackingMiddleware: Middleware =
  () => (next: Dispatch<AnyAction>) =>
    interceptDispatch(next, TrackEventType, events, process.env.NODE_ENV);

/**
 * Function to track events outside redux
 * @param trackEventType event name
 * @param attributes optional additional attributes
 */
export const trackEventByType = (trackEventType: TrackEventType, attributes?: object) => {
  const eventParameters = attributes
    ? { ...events[trackEventType], attributes: { ...attributes } }
    : events[trackEventType];

  trackEvent(trackEventType, process.env.NODE_ENV, eventParameters);
};

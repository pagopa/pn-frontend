import { AnyAction, Dispatch, Middleware, PayloadAction } from '@reduxjs/toolkit';
import { init, track, Mixpanel } from 'mixpanel-browser';
import { events, TrackEventType } from './events';
/**
 * Function that initialize Mixpanel (must be called once)
 */
export const mixpanelInit = function (): void {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('Mixpanel events mock on console log.');
  } else if (process.env.NODE_ENV === 'test') {
    return;
  } else {
    init('mocked-key', {
      api_host: 'https://api-eu.mixpanel.com',
      persistence: 'localStorage',
      // if this is true, Mixpanel will automatically determine
      // City, Region and Country data using the IP address of
      // the client
      ip: false,
      // names of properties/superproperties which should never
      // be sent with track() calls
      property_blacklist: [],
      // function called after mixpanel has finished loading
      loaded(mixpanel: Mixpanel) {
        // this is useful to obtain a new distinct_id every session
        // the distinct_id is the user identifier that mixpanel automatically assign
        if (sessionStorage.getItem('user') === null) {
          mixpanel.reset();
        }
      },
    });
  }
};

/**
 * Function that tracks event
 * @param event_name event name
 * @param properties event data
 */
function trackEvent(event_name: string, properties?: any): void {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(event_name, properties);
  } else if (process.env.NODE_ENV === 'test') {
    return;
  } else {
    try {
      /*
      if (ENV === "UAT") {
        track(event_name, { ...properties, ...{ environment: "UAT" } });
      } else {
        track(event_name, properties);
      }
      */
      track(event_name, properties);
    } catch (_) {
      // eslint-disable-next-line no-console
      console.log(event_name, properties);
    }
  }
}

/**
 * Redux middleware to track events
 */
export const trackingMiddleware: Middleware =
  // ({getState}: MiddlewareAPI<any>) =>
  () =>
  (next: Dispatch<AnyAction>) =>
  (action: PayloadAction<any, string>): any => {
    if (action.type in events) {
      const idx = Object.values(TrackEventType).indexOf(action.type as TrackEventType);
      const eventKey = Object.keys(TrackEventType)[idx];
      const attributes = events[action.type].getAttributes?.(action.payload);

      const eventParameters = attributes
          ? { category: events[action.type].category, action: events[action.type].action, attributes }
          : events[action.type];
      trackEvent(eventKey, eventParameters);
    }

    return next(action);
  };

/**
 * Function to track events outside redux
 * @param trackEventType event name
 * @param attributes event attributes
 */
export const trackEventByType = (trackEventType: TrackEventType, attributes?: object) => {
  const eventParameters = attributes
    ? { ...events[trackEventType], attributes: { ...attributes } }
    : events[trackEventType];

  trackEvent(trackEventType, eventParameters);
};

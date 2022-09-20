import mixpanel, { Mixpanel} from 'mixpanel-browser';
// PN-1369 leave default import for mixpanel, using named once it won't work
import { MIXPANEL_TOKEN } from './constants';
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
    mixpanel.init(MIXPANEL_TOKEN, {
      api_host: 'https://api-eu.mixpanel.com',
      persistence: 'localStorage',
      // if this is true, Mixpanel will automatically determine
      // City, Region and Country data using the IP address of
      // the client
      ip: false,
      // names of properties/superproperties which should never
      // be sent with track() calls
      property_blacklist: ['$current_url', '$initial_referrer', '$referrer'],
      debug: true,
      // function called after mixpanel has finished loading
      loaded(mixpanel: Mixpanel) {
        // this is useful to obtain a new distinct_id every session
        // the distinct_id is the user identifier that mixpanel automatically assign
        if (sessionStorage.getItem('') === null) {
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
  if (process.env.NODE_ENV === 'test') {
    return;
  } else if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    console.log(event_name, properties);
  } else {
    try {
      mixpanel.track(event_name, { ...properties, ...{ environment: 'DEV' } });
    } catch (_) {
      // eslint-disable-next-line no-console
      console.log(event_name, properties);
    }
  }
}

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

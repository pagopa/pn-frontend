// PN-1369 leave default import for mixpanel, using named once it won't work
import mixpanel from 'mixpanel-browser';

/**
 * Function that initialize Mixpanel (must be called once)
 */
export function mixpanelInit(mixpanelToken: string, nodeEnv: string): void {
  if (nodeEnv === 'test') {
    return;
  }

  const isLocal = !nodeEnv || nodeEnv === 'development';

  mixpanel.init(mixpanelToken, {
    api_host: isLocal ? '/mock-mixpanel' : 'https://api-eu.mixpanel.com',
    persistence: 'localStorage',
    stop_utm_persistence: true,
    // if this is true, Mixpanel wil l automatically determine
    // City, Region and Country data using the IP address of
    // the client
    ip: false,
    // names of properties/superproperties which should never
    // be sent with track() calls
    property_blacklist: ['$current_url', '$initial_referrer', '$referrer'],
    debug: isLocal,
  });
  mixpanel.identify(mixpanel.get_distinct_id());
}

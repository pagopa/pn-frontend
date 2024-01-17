// leave default import for mixpanel, using named once it won't work
import mixpanel from 'mixpanel-browser';
/**
 * Function that tracks event
 * @param event_name event name
 * @param nodeEnv current environment
 * @param properties event data
 */
export function trackEvent(event_name, nodeEnv, properties) {
    if (nodeEnv === 'test') {
        return;
    }
    else if (!nodeEnv || nodeEnv === 'development') {
        // eslint-disable-next-line no-console
        console.log(event_name, properties);
    }
    else {
        try {
            mixpanel.track(event_name, properties);
        }
        catch (_) {
            // eslint-disable-next-line no-console
            console.log(event_name, properties);
        }
    }
}
export const interceptDispatch = (next, trackEventType, events, nodeEnv) => (action) => {
    if (action.type in events) {
        const idx = Object.values(trackEventType).indexOf(action.type);
        const eventKey = Object.keys(trackEventType)[idx];
        const attributes = events[action.type].getAttributes?.(action.payload);
        const eventParameters = attributes
            ? {
                event_category: events[action.type].event_category,
                event_type: events[action.type].event_type,
                ...attributes,
            }
            : events[action.type];
        trackEvent(eventKey, nodeEnv, eventParameters);
    }
    return next(action);
};

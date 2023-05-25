// leave default import for mixpanel, using named once it won't work
import mixpanel from "mixpanel-browser";
import { AnyAction, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { EventsType } from "../types/MixpanelEvents";

/**
 * Function that tracks event
 * @param event_name event name
 * @param nodeEnv current environment
 * @param properties event data
 */
export function trackEvent(event_name: string, nodeEnv: string, properties?: any): void {
  if (nodeEnv === 'test') {
    return;
  } else if (!nodeEnv || nodeEnv === 'development') {
    // eslint-disable-next-line no-console
    console.log(event_name, properties);
  } else {
    try {
      mixpanel.track(event_name, properties);
    } catch (_) {
      // eslint-disable-next-line no-console
      console.log(event_name, properties);
    }
  }
}

export const interceptDispatch =
  (next: Dispatch<AnyAction>, trackEventType: { [s: number]: string }, events: EventsType, nodeEnv: string) =>
  (action: PayloadAction<any, string>): any => {
    if (action.type in events) {
      const idx = Object.values(trackEventType).indexOf(action.type as string);
      const eventKey = Object.keys(trackEventType)[idx];
      const attributes = events[action.type].getAttributes?.(action.payload);

      const eventParameters = attributes
        ? {
          category: events[action.type].category,
          action: events[action.type].action,
          attributes,
        }
        : events[action.type];
      trackEvent(eventKey, nodeEnv, eventParameters);
    }

    return next(action);
  };
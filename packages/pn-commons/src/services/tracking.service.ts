// leave default import for mixpanel, using named once it won't work
import mixpanel from 'mixpanel-browser';

import { AnyAction, Dispatch, PayloadAction } from '@reduxjs/toolkit';

import { EventsType, ProfileMapAttributes, ProfilePropertyType } from '../models/MixpanelEvents';

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

/**
 * Set mixpanel user properties
 */
export function setSuperOrProfileProperty(
  propertyType: ProfilePropertyType,
  property: any,
  nodeEnv: string
): void {
  if (!nodeEnv || nodeEnv === 'development') {
    // eslint-disable-next-line no-console
    console.log(
      'Mixpanel events mock on console log - profile properties',
      { propertyType },
      property
    );
  } else if (nodeEnv === 'test') {
    return;
  } else {
    try {
      switch (propertyType) {
        case 'profile':
          mixpanel.people.set(property);
          break;
        case 'incremental':
          mixpanel.people.increment(property);
          break;
        case 'superProperty':
          mixpanel.register(property);
          break;
        default:
          mixpanel.people.set(property);
      }
    } catch (_) {
      // eslint-disable-next-line no-console
      console.log(property);
    }
  }
}

export const interceptDispatch =
  (
    next: Dispatch<AnyAction>,
    events: EventsType,
    eventsActionsMap: Record<string, string>,
    nodeEnv: string
  ) =>
  (action: PayloadAction<any, string>): any => {
    if (eventsActionsMap[action.type]) {
      // const idx = Object.values(trackEventType).indexOf(action.type as string);
      const eventKey = eventsActionsMap[action.type];
      // TODO check payload
      const attributes = events[eventKey].getAttributes?.(action.payload);
      const eventParameters = attributes
        ? {
            event_category: events[eventKey].event_category,
            event_type: events[eventKey].event_type,
            ...attributes,
          }
        : events[eventKey];
      trackEvent(eventKey, nodeEnv, eventParameters);
    }

    return next(action);
  };

export const interceptDispatchSuperOrProfileProperty =
  (
    next: Dispatch<AnyAction>,
    eventsActionsMap: Record<string, ProfileMapAttributes>,
    nodeEnv: string
  ) =>
  (action: PayloadAction<any, string, any>): any => {
    if (eventsActionsMap[action.type]) {
      const eventKey = eventsActionsMap[action.type];
      const profilePropertyType = eventKey?.profilePropertyType;
      const attributes = eventKey?.getAttributes?.(action?.payload, action?.meta);

      if (eventKey?.shouldBlock && eventKey?.shouldBlock(action?.payload, action?.meta)) {
        return next(action);
      }

      profilePropertyType.forEach((type) => {
        setSuperOrProfileProperty(type, attributes, nodeEnv);
      });
    }

    return next(action);
  };

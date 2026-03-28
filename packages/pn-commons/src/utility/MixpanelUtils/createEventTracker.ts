import type { EventPropertyType, TrackedEvent } from '../../models/MixpanelEvents';
import { trackEvent } from '../../services/tracking.service';

export type EventDefinition<TPayload> = {
  build: (payload: TPayload) => TrackedEvent;
};

/**
 * MIGRATION ONLY:
 * `EventPayloadMap` / `EventRegistry` are intentionally `Partial` while incrementally migrating events.
 *
 * Post-migration (full coverage) - requires a complete payload map and a complete registry: remove
 * `Partial` and switch to:
 *
 * export type EventPayloadMap<TEventName extends string> = Record<TEventName, unknown>;
 *
 * export type EventRegistry<
 *   TEventName extends string,
 *   TPayloads extends EventPayloadMap<TEventName>
 * > = { [TEventKey in keyof TPayloads]-?: EventDefinition<TPayloads[TEventKey]> };
 */
export type EventPayloadMap<TEventName extends string> = Partial<Record<TEventName, unknown>>;

export type EventRegistry<
  TEventName extends string,
  TPayloads extends EventPayloadMap<TEventName>
> = Partial<{ [TEventKey in keyof TPayloads]: EventDefinition<TPayloads[TEventKey]> }>;

type PayloadArg<T> = [T] extends [void] ? [] : [payload: T];

export const createEventTracker = <
  TEventName extends string,
  TPayloads extends EventPayloadMap<TEventName>
>(
  registry: EventRegistry<TEventName, TPayloads>
) => ({
  trigger: <TEventKey extends keyof TPayloads>(
    eventName: TEventKey,
    ...args: PayloadArg<TPayloads[TEventKey]>
  ): void => {
    try {
      const definition = registry[eventName];

      if (!definition) {
        throw new Error('Unknown event type ' + String(eventName));
      }

      const payload = args[0] as TPayloads[TEventKey];
      const trackedEvent = definition.build(payload);

      for (const [propertyType, properties] of Object.entries(trackedEvent)) {
        trackEvent(
          propertyType as EventPropertyType,
          String(eventName),
          process.env.NODE_ENV!,
          properties
        );
      }
    } catch (error) {
      console.error('MIXPANEL - Tracking error: ', eventName, error);
    }
  },
});

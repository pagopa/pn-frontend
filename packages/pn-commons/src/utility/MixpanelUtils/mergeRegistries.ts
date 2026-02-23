import type { EventDefinition, EventPayloadMap, EventRegistry } from './createEventTracker';

const hasOwn = <T extends object>(obj: T, key: PropertyKey): boolean =>
  Object.prototype.hasOwnProperty.call(obj, key);

export const mergeRegistries = <TEvent extends string, TPayloads extends EventPayloadMap<TEvent>>(
  ...parts: Array<EventRegistry<TEvent, TPayloads>>
): EventRegistry<TEvent, TPayloads> =>
  parts.reduce<EventRegistry<TEvent, TPayloads>>((acc, part) => {
    // NOTE: Object.entries() loses key/value typing, so we cast entries to iterate with typed keys
    const entries = Object.entries(part) as Array<
      [keyof TPayloads, EventDefinition<TPayloads[keyof TPayloads]>]
    >;

    return entries.reduce<EventRegistry<TEvent, TPayloads>>((innerAcc, [key, def]) => {
      if (process.env.NODE_ENV === 'development' && hasOwn(innerAcc, key)) {
        console.warn('[mixpanel] duplicated event key in registries:', key);
      }
      return { ...innerAcc, [key]: def };
    }, acc);
  }, {});

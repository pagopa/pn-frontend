import { useEffect, useState, useCallback } from "react";
import globalEventEmitter from "../services/event-emitter.service";

export const useEventEmitter = <T>(eventName: string) => {
  const [eventData, setEventData] = useState<T>();

  const publishEvent = useCallback(
    (eventData: T) => {
      const event = new CustomEvent(eventName, { detail: eventData });
      globalEventEmitter.dispatchEvent(event);
    },
    [eventName]
  );

  useEffect(() => {
    const listener = (event: Event) => {
      setEventData((event as CustomEvent).detail);
    };

    globalEventEmitter.addEventListener(eventName, listener);

    // Cleanup subscription on unmount
    return () => {
      globalEventEmitter.removeEventListener(eventName, listener);
    };
  }, [eventName]);

   return { eventData, publishEvent };
};
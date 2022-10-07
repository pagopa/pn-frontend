/* eslint-disable functional/immutable-data */
import { useSelector } from 'react-redux';
import { useEffect } from "react";

import { AppResponse, AppResponseOutcome } from "../../types/AppResponse";

type CallBackFunction = (err: AppResponse) => void;

type EventsList = {
  [index: string]: Array<CallBackFunction>;
};

/**
 * Singleton managing two different types of subscriptions:
 * - regular subscribers register for a particular event publication
 * - fallback subscribers register to be notified if there's no regular
 *   subscribers for the particular event to be published
 */
class AppResponsePublisher {
  private static instance: {
    success: AppResponsePublisher | undefined;
    error: AppResponsePublisher | undefined;
  };
  private regularQueue: EventsList = {};
  private fallbackQueue: Array<CallBackFunction> = [];
  
  constructor (type: AppResponseOutcome) {
    if(!AppResponsePublisher.instance) {
      AppResponsePublisher.instance = {
        success: undefined,
        error: undefined
      };
    }
    if (!AppResponsePublisher.instance[type]) {
      AppResponsePublisher.instance[type] = this;
    }
    return AppResponsePublisher.instance[type] || this;
  }
  /**
   * simulate overloading allowing two possible usage:
   * - subscribe(eventName, func) to register a regular subscriber
   * - subscribe(func): to register a fallback subscriber
   */
  subscribe (a: string | CallBackFunction, b: CallBackFunction | null = null) {
    if(typeof a === 'string' && b){
      this.regularSubscribe(a, b);
    } else if ( typeof a === 'function') {
      this.fallbackSubscribe(a);
    } else {
      console.log("subscribe should be called either using a single function param or two params of type string and function respectively");
      // throw new Error('');
    }
  }

  /**
   * same as subscribe()
   */
  unsubscribe(a: string | CallBackFunction, b: CallBackFunction | null = null) {
    if(typeof a === 'string' && b){
      this.regularUnsubscribe(a, b);
    } else if ( typeof a === 'function') {
      this.fallbackUnsubscribe(a);
    } else {
      console.log("unsubscribe should be called either using a single function param or two params of type string and function respectively");
      // throw new Error('');
    }
  }

  publish(eventName: string, error: AppResponse) {
    const callbacks = this.regularQueue[eventName];
    // console.log(callbacks);
    if (Array.isArray(callbacks) && callbacks.length > 0) {
      callbacks.forEach((callback) => {
        callback.apply(null, [error]);
      });
    } else {
      this.fallbackQueue.forEach((func) => {
        func.apply(null, [error]);
      });
    }
  }

  private regularSubscribe (eventName: string, func: (err: AppResponse) => void) {
    if (this.regularQueue[eventName]) {
      this.regularQueue[eventName].push(func);
    } else {
      this.regularQueue[eventName] = [func];
    }
  }

  private fallbackSubscribe(func: CallBackFunction) {
    this.fallbackQueue.push(func);
  }

  private regularUnsubscribe(eventName: string, func: (err: AppResponse) => void) {
    if(this.regularQueue[eventName]){
      this.regularQueue[eventName] = this.regularQueue[eventName].filter((subscriber) => subscriber !== func);
    }
  }

  private fallbackUnsubscribe(func: CallBackFunction) {
    this.fallbackQueue = this.fallbackQueue.filter((subscriber) => subscriber !== func);
  }
}

const success = new AppResponsePublisher('success');
const error = new AppResponsePublisher('error');

export const ResponseEventDispatcher = () => {
  const responseEvent = useSelector((state: any) => state.appState.responseEvent);

  useEffect(() => {
    if(responseEvent) {
      if(responseEvent.outcome === 'success') {
        success.publish(responseEvent.name, responseEvent.response);
      } else {
        error.publish(responseEvent.name, responseEvent.response);
      }
      // TODO: dispatch the action to reset the store (state.appState.responseEvent = null)
    }

  }, [responseEvent]);
  
  return <></>;
};

export default {
  success,
  error
};
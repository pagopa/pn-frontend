/* eslint-disable functional/immutable-data */
import { ServerResponseErrorCode, AppResponse } from "../../types/AppError";

type CallBackFunction = (err: AppResponse) => void;

type EventsList = {
  [index: string]: Array<CallBackFunction>;
};

class AppErrorPublisher {
  private static instance: AppErrorPublisher;
  private events: EventsList = {};
  private default: Array<CallBackFunction> = [];
  
  constructor () {
    if (!AppErrorPublisher.instance) {
      // console.log("APPERROR_PUBLISHER CALLED FOR THE FIRST TIME!");
      // Initialize object
      AppErrorPublisher.instance = this;
    }
    return AppErrorPublisher.instance;
  }
  /**
   * simulate overloading
   * if 'a' is a string attach the b callback to event 'a'
   * otherwise put 'a' callback
   *  */
  subscribe (a: string | CallBackFunction, b: CallBackFunction | null = null) {
    if( typeof a === 'string' && b){
      this.regularSubscribe(a, b);
    } else if ( typeof a === 'function') {
      this.defaultSubscribe(a);
    } else {
      console.log("subscribe should be called either using a single function param or two params of type string and function respectively");
      // throw new Error('');
    }
  }

  regularSubscribe (eventName: string, func: (err: AppResponse) => void) {
    if (this.events[eventName]) {
      this.events[eventName].push(func);
      console.log(`${func.name} has subscribed to ${eventName}!`);
    } else {
      this.events[eventName] = [func];
      console.log(`${func.name} has subscribed to ${eventName}!`);
    }
  }
  defaultSubscribe(func: CallBackFunction) {
    this.default.push(func);
  }

  unsubscribe(a: string | CallBackFunction, b: CallBackFunction | null = null) {
    if( typeof a === 'string' && b){
      this.regularUnsubscribe(a, b);
    } else if ( typeof a === 'function') {
      this.defaultUnsubscribe(a);
    } else {
      console.log("unsubscribe should be called either using a single function param or two params of type string and function respectively");
      // throw new Error('');
    }
  }
  regularUnsubscribe(eventName: string, func: (err: AppResponse) => void) {
    if(this.events[eventName]){
      // eslint-disable-next-line functional/immutable-data
      this.events[eventName] = this.events[eventName].filter((subscriber) => subscriber !== func);
      console.log(`${func.name} has unsubscribed from ${eventName}!`);
    }
  }
  defaultUnsubscribe(func: CallBackFunction) {
    this.default = this.default.filter((subscriber) => subscriber !== func);
  }

  publish(eventName: ServerResponseErrorCode, error: AppResponse) {
    const callbacks = this.events[eventName];
    console.log(callbacks);
    if (Array.isArray(callbacks) && callbacks.length > 0) {
      callbacks.forEach((callback) => {
        callback.apply(null, [error]);
      });
    } else {
      this.default.forEach((func) => {
        func.apply(null, [error]);
      });
    }
  }
}

const instance = new AppErrorPublisher();
// Object.freeze(instance)

export default instance;









  // subscription (eventName: AppErrorTypes, func: (err: AppError) => any) {
  //   return {
  //     subscribe: () => {
  //       if (this.events[eventName]) {
  //         this.events[eventName].push(func);
  //         console.log(`${func.name} has subscribed to ${eventName} Handling!`);
  //       } else {
  //         this.events[eventName] = [func];
  //         console.log(`${func.name} has subscribed to ${eventName} Handling!`);
  //       }
  //     },
      
  //     unsubscribe: () => {
  //       if(this.events[eventName]){
  //         this.events[eventName] = this.events[eventName].filter((subscriber) => subscriber !== func);
  //         console.log(`${func.name} has unsubscribed from ${eventName} Topic!`);
  //       }
  //     }
  //   }
  // }
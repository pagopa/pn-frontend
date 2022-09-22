import { AppErrorTypes } from "../../types/AppError";
import { AppError } from "./AppError";

type CallBackFunction = (err: AppError) => void;

type EventsList = {
  [index: string]: Array<CallBackFunction>
};

class AppErrorPublisher {
  private static instance: AppErrorPublisher;
  private events: EventsList = {};
  
  constructor () {
    if (!AppErrorPublisher.instance) {
      console.log("APPERROR_PUBLISHER CALLED FOR THE FIRST TIME!");
      // Initialize object
      AppErrorPublisher.instance = this;
    }
    return AppErrorPublisher.instance;
  }

  subscribe (eventName: AppErrorTypes, func: (err: AppError) => void) {
    if (this.events[eventName]) {
      this.events[eventName].push(func);
      console.log(`${func.name} has subscribed to ${eventName}!`);
    } else {
      this.events[eventName] = [func];
      console.log(`${func.name} has subscribed to ${eventName}!`);
    }
  }
  unsubscribe (eventName: AppErrorTypes, func: (err: AppError) => void) {
    if(this.events[eventName]){
      this.events[eventName] = this.events[eventName].filter((subscriber) => subscriber !== func);
      console.log(`${func.name} has unsubscribed from ${eventName}!`);
    }
  }

  publish(eventName: AppErrorTypes, error: AppError) {
    const callbacks = this.events[eventName];
    console.log(callbacks);
    if (Array.isArray(callbacks)) {
      callbacks.forEach((callback) => {
        callback.apply(null, [error]);
      });
    }
  }

  getEvents() {
    return this.events;
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
/// <reference types="react" />
import { AppResponse, AppResponseOutcome } from "../../types/AppResponse";
declare type CallBackFunction = (err: AppResponse) => void | boolean;
/**
 * Singleton managing two different types of subscriptions:
 * - regular subscribers register for a particular event publication
 * - fallback subscribers register to be notified if there's no regular
 *   subscribers for the particular event to be published
 */
declare class AppResponsePublisher {
    private static instance;
    private regularQueue;
    private fallbackQueue;
    constructor(type: AppResponseOutcome);
    /**
     * simulate overloading allowing two possible usage:
     * - subscribe(eventName, func) to register a regular subscriber
     * - subscribe(func): to register a fallback subscriber
     */
    subscribe(a: string | CallBackFunction, b?: CallBackFunction | null): void;
    /**
     * same as subscribe()
     */
    unsubscribe(a: string | CallBackFunction, b?: CallBackFunction | null): void;
    publish(eventName: string, response: AppResponse): void;
    private regularSubscribe;
    private fallbackSubscribe;
    private regularUnsubscribe;
    private fallbackUnsubscribe;
}
export declare const ResponseEventDispatcher: () => JSX.Element;
declare const _default: {
    success: AppResponsePublisher;
    error: AppResponsePublisher;
};
export default _default;

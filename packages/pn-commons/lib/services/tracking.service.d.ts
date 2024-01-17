import { AnyAction, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { EventsType } from '../models/MixpanelEvents';
/**
 * Function that tracks event
 * @param event_name event name
 * @param nodeEnv current environment
 * @param properties event data
 */
export declare function trackEvent(event_name: string, nodeEnv: string, properties?: any): void;
export declare const interceptDispatch: (next: Dispatch<AnyAction>, trackEventType: {
    [s: number]: string;
}, events: EventsType, nodeEnv: string) => (action: PayloadAction<any, string>) => any;

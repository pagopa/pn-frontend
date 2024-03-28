import { interceptDispatch } from '@pagopa-pn/pn-commons';
import { AnyAction, Dispatch, Middleware } from '@reduxjs/toolkit';

import { PFEventsType, eventsActionsMap } from '../models/PFEventsType';
import PFEventStrategyFactory from './MixpanelUtils/PFEventStrategyFactory';

/**
 * Redux middleware to track events
 */
export const trackingMiddleware: Middleware = () => (next: Dispatch<AnyAction>) =>
  interceptDispatch<PFEventsType>(next, PFEventStrategyFactory, eventsActionsMap);

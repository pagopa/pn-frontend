import { interceptDispatch } from '@pagopa-pn/pn-commons';
import { AnyAction, Dispatch, Middleware } from '@reduxjs/toolkit';

import { eventsActionsMap } from '../models/PFEventsType';
import PFEventStrategyFactory from './MixpanelUtils/PFEventStrategyFactory';

/**
 * Redux middleware to track events
 */
export const trackingMiddleware: Middleware = () => (next: Dispatch<AnyAction>) =>
  interceptDispatch(next, PFEventStrategyFactory, eventsActionsMap);

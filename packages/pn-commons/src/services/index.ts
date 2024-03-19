import { Configuration } from './configuration.service';
import {
  interceptDispatch,
  interceptDispatchSuperOrProfileProperty,
  setSuperOrProfileProperty,
  trackEvent,
} from './tracking.service';

export {
  trackEvent,
  interceptDispatch,
  Configuration,
  setSuperOrProfileProperty,
  interceptDispatchSuperOrProfileProperty,
};

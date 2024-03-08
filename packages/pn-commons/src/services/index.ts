import { Configuration } from './configuration.service';
import {
  PropertyType,
  interceptDispatch,
  setProfileProperty,
  trackEvent,
} from './tracking.service';

export { trackEvent, interceptDispatch, Configuration, setProfileProperty };
export type { PropertyType };

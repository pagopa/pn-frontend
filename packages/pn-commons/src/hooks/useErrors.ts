import { useSelector } from 'react-redux';

import { IAppMessage } from '../models/AppMessage';
import { appStateSelectors } from '../redux/slices/appStateSlice';

/**
 * A custom React hook for handling and checking API errors in the application state.
 *
 * @returns {Object} An object containing the `hasApiErrors` and `hasSpecificStatusError` function.
 */
export function useErrors(): {
  hasApiErrors: (actionType?: string) => boolean;
  hasSpecificStatusError: (status: number, actionType?: string) => boolean;
} {
  const errors = useSelector(appStateSelectors.selectErrors);

  function hasApiErrors(actionType?: string) {
    return actionType
      ? !!errors.find((err: IAppMessage) => err.action === actionType)
      : !!errors.find((err: IAppMessage) => err.action != null);
  }

  function hasSpecificStatusError(status: number, actionType?: string) {
    return actionType
      ? !!errors.find((err: IAppMessage) => err.status === status && err.action === actionType)
      : !!errors.find((err: IAppMessage) => err.status === status && err.action != null);
  }

  return { hasApiErrors, hasSpecificStatusError };
}

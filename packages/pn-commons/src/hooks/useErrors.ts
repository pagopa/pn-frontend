import { useSelector } from 'react-redux';

import { IAppMessage } from '../models';
import { appStateSelectors } from '../redux';

/**
 * A custom React hook for handling and checking API errors in the application state.
 *
 * @returns {Object} An object containing the `hasApiErrors` function.
 */
export function useErrors(): { hasApiErrors: (actionType?: string) => boolean, hasForbiddenError: (actionType?: string) => boolean } {
  const errors = useSelector(appStateSelectors.selectErrors);

  function hasApiErrors(actionType?: string) {
    return actionType
      ? !!errors.find((err: IAppMessage) => err.action === actionType)
      : !!errors.find((err: IAppMessage) => err.action != null);
  }

  function hasForbiddenError(actionType?: string) {
    return actionType
      ? !!errors.find((err: IAppMessage) => err.action === actionType && err.status === 403)
      : !!errors.find((err: IAppMessage) => err.action != null && err.status === 403);
  }

  return { hasApiErrors, hasForbiddenError };
}

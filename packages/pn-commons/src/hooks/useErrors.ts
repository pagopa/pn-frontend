import { useSelector } from 'react-redux';

import { appStateSelectors } from '../redux';
import { IAppMessage } from '../types';

/**
 * A custom React hook for handling and checking API errors in the application state.
 *
 * @returns {Object} An object containing the `hasApiErrors` function.
 */
export function useErrors(): { hasApiErrors: (actionType?: string) => boolean } {
  const errors = useSelector(appStateSelectors.selectErrors);

  function hasApiErrors(actionType?: string) {
    return actionType
      ? !!errors.find((err: IAppMessage) => err.action === actionType)
      : !!errors.find((err: IAppMessage) => err.action != null);
  }

  return { hasApiErrors };
}

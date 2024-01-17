import { useSelector } from 'react-redux';
import { appStateSelectors } from '../redux';
/**
 * A custom React hook for handling and checking API errors in the application state.
 *
 * @returns {Object} An object containing the `hasApiErrors` function.
 */
export function useErrors() {
    const errors = useSelector(appStateSelectors.selectErrors);
    function hasApiErrors(actionType) {
        return actionType
            ? !!errors.find((err) => err.action === actionType)
            : !!errors.find((err) => err.action != null);
    }
    return { hasApiErrors };
}

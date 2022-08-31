import { useSelector } from 'react-redux';
import { appStateSelectors } from '../redux';
import { IAppMessage } from '../types';

export function useErrors(): { hasApiErrors: ((actionType: string) => boolean) } {
    const errors = useSelector(appStateSelectors.selectErrors);

    function hasApiErrors(actionType: string) {
        return !!errors.find((err: IAppMessage) => err.action === actionType);
    }

    return { hasApiErrors };
}
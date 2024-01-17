import { Fragment as _Fragment, jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useErrors } from '../../hooks';
import ApiError from './ApiError';
export const ApiErrorWrapperGeneral = ({ apiId, children, errorComponent, }) => {
    const { hasApiErrors } = useErrors();
    const hasParticularApiErrors = hasApiErrors(apiId);
    return (_jsxs(_Fragment, { children: [!hasParticularApiErrors && children, hasParticularApiErrors && errorComponent] }));
};
/**
 * ApiErrorWrapper is a component that will let you manage data renderizations issues in case the api populating those data fails.
 * @param {string | undefined} apiId The api to manage
 * @param {React.ReactNode} children The data visualization component, eg. a table, a list..
 * @param {(() => void) | undefined} reloadAction Reload action callback. Default calls window.location.reload
 * @param {any} mt
 * @param {string | undefined } mainText Main text to show user if the api fails. Default is 'Non siamo riusciti a recuperare questi dati.'
 * @returns {any}
 */
const ApiErrorWrapper = ({ apiId, children, reloadAction, mt, mainText, }) => (_jsx(ApiErrorWrapperGeneral, { apiId: apiId, errorComponent: _jsx(ApiError, { onClick: reloadAction, mt: mt, mainText: mainText, apiId: apiId }), children: children }));
export default ApiErrorWrapper;

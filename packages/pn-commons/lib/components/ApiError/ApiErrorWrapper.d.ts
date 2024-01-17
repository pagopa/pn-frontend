/// <reference types="react" />
interface ApiErrorWrapperCommonProps {
    apiId?: string;
}
interface ApiErrorWrapperProps extends ApiErrorWrapperCommonProps {
    reloadAction?: () => void;
    mt?: number;
    mainText?: string;
}
interface ApiErrorWrapperGeneralProps extends ApiErrorWrapperCommonProps {
    errorComponent: JSX.Element;
}
export declare const ApiErrorWrapperGeneral: React.FC<ApiErrorWrapperGeneralProps>;
/**
 * ApiErrorWrapper is a component that will let you manage data renderizations issues in case the api populating those data fails.
 * @param {string | undefined} apiId The api to manage
 * @param {React.ReactNode} children The data visualization component, eg. a table, a list..
 * @param {(() => void) | undefined} reloadAction Reload action callback. Default calls window.location.reload
 * @param {any} mt
 * @param {string | undefined } mainText Main text to show user if the api fails. Default is 'Non siamo riusciti a recuperare questi dati.'
 * @returns {any}
 */
declare const ApiErrorWrapper: React.FC<ApiErrorWrapperProps>;
export default ApiErrorWrapper;

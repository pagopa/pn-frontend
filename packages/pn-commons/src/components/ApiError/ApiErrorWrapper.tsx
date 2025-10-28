import { useErrors } from '../../hooks/useErrors';
import ApiError from './ApiError';

interface ApiErrorWrapperCommonProps {
  apiId?: string;
  children?: React.ReactNode;
}

interface ApiErrorWrapperProps extends ApiErrorWrapperCommonProps {
  reloadAction?: () => void;
  mt?: number;
  mainText?: string;
}

interface ApiErrorWrapperGeneralProps extends ApiErrorWrapperCommonProps {
  errorComponent: JSX.Element;
}

export const ApiErrorWrapperGeneral: React.FC<ApiErrorWrapperGeneralProps> = ({
  apiId,
  children,
  errorComponent,
}) => {
  const { hasApiErrors } = useErrors();

  const hasParticularApiErrors = hasApiErrors(apiId);

  return (
    <>
      {!hasParticularApiErrors && children}
      {hasParticularApiErrors && errorComponent}
    </>
  );
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
const ApiErrorWrapper: React.FC<ApiErrorWrapperProps> = ({
  apiId,
  children,
  reloadAction,
  mt,
  mainText,
}) => (
  <ApiErrorWrapperGeneral
    apiId={apiId}
    errorComponent={<ApiError onClick={reloadAction} mt={mt} mainText={mainText} apiId={apiId} />}
  >
    {children}
  </ApiErrorWrapperGeneral>
);

export default ApiErrorWrapper;

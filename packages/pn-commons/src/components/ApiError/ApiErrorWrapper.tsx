import { useErrors } from '../../hooks';
import ApiError from './ApiError';

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

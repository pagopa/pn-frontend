import { useErrors } from "../../hooks";
import ApiError from "./ApiError";

interface ApiErrorGuardCommonProps {
  apiId: string;
}

interface ApiErrorGuardProps extends ApiErrorGuardCommonProps {
  reloadAction: () => void;
  mt?: number;
  mainText?: string;
}

interface ApiErrorGuardGeneralProps extends ApiErrorGuardCommonProps  {
  errorComponent: JSX.Element;
}

export const ApiErrorGuardGeneral: React.FC<ApiErrorGuardGeneralProps> = ({ apiId, children, errorComponent }) => {
  const { hasApiErrors } = useErrors();

  const hasParticularApiErrors = hasApiErrors(apiId);

  return <>
      { !hasParticularApiErrors && children }
      { hasParticularApiErrors && errorComponent }
  </>;
};

const ApiErrorGuard: React.FC<ApiErrorGuardProps> = ({ apiId, children, reloadAction, mt, mainText }) => {
  return <ApiErrorGuardGeneral 
    apiId={apiId} 
    errorComponent={<ApiError onClick={reloadAction} mt={mt} mainText={mainText} />} 
  >
    {children}
  </ApiErrorGuardGeneral>
};

export default ApiErrorGuard;

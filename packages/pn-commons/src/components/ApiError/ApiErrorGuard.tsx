import { useErrors } from "../../hooks";
import ApiError from "./ApiError";

interface ApiErrorGuardCommonProps {
  apiId: string;
  component: JSX.Element;
}

interface ApiErrorGuardProps extends ApiErrorGuardCommonProps {
  reloadAction: () => void;
  mt?: number;
}

interface ApiErrorGuardGeneralProps extends ApiErrorGuardCommonProps  {
  errorComponent: JSX.Element;
}

export const ApiErrorGuardGeneral: React.FC<ApiErrorGuardGeneralProps> = ({ apiId, component, errorComponent }) => {
  const { hasApiErrors } = useErrors();

  const hasParticularApiErrors = hasApiErrors(apiId);

  return <>
      { !hasParticularApiErrors && component }
      { hasParticularApiErrors && errorComponent }
  </>;
};

const ApiErrorGuard: React.FC<ApiErrorGuardProps> = ({ apiId, component, reloadAction, mt }) => {
  return <ApiErrorGuardGeneral 
    apiId={apiId} component={component} 
    errorComponent={<ApiError onClick={reloadAction} mt={mt} />} 
  />;
};

export default ApiErrorGuard;

import { useErrors } from "../../hooks";
import ApiError from "./ApiError";

interface ApiErrorGuardProps {
  apiId: string;
  component: JSX.Element;
  reloadAction: () => void;
  mt?: number;
}

const ApiErrorGuard: React.FC<ApiErrorGuardProps> = ({ apiId, component, reloadAction, mt }) => {
  const { hasApiErrors } = useErrors();

  const hasParticularApiErrors = hasApiErrors(apiId);

  return <>
      { !hasParticularApiErrors && component }
      { hasParticularApiErrors && <ApiError onClick={reloadAction} mt={mt} /> }
  </>;
};

export default ApiErrorGuard;

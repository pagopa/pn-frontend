import { useLocation, useNavigate } from 'react-router-dom';

interface LocationState {
  from?: string;
}

export const usePreviousLocation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const previousLocation = (location.state as LocationState)?.from ?? undefined;

  const navigateWithState = (path: string) => {
    navigate(path, { state: { from: location.pathname } });
  };

  const navigateToPreviousLocation = () => {
    if (previousLocation) {
      navigate(previousLocation, { replace: true });
    } else {
      navigate(-1);
    }
  };

  return { navigateWithState, navigateToPreviousLocation, previousLocation };
};

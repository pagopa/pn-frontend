import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ROUTE_ONE_IDENTITY_LOGIN } from '../../navigation/routes.const';
import {
  storageOneIdentityNonce,
  storageOneIdentityState,
  storageRapidAccessOps,
} from '../../utility/storage';

const OneIdentityLogout: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    storageRapidAccessOps.delete();
    storageOneIdentityState.delete();
    storageOneIdentityNonce.delete();

    const queryString = searchParams.toString();

    const route = queryString
      ? `${ROUTE_ONE_IDENTITY_LOGIN}?${queryString}`
      : ROUTE_ONE_IDENTITY_LOGIN;

    navigate(route, { replace: true });
  }, []);

  return <></>;
};

export default OneIdentityLogout;

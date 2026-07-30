import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ROUTE_LOGIN } from '../../navigation/routes.const';

const OneIdentityLogout: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const queryString = searchParams.toString();

    const route = queryString ? `${ROUTE_LOGIN}?${queryString}` : ROUTE_LOGIN;

    navigate(route, { replace: true });
  }, []);

  return <></>;
};

export default OneIdentityLogout;

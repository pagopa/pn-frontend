import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTE_LOGIN } from '../../utils/constants';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(ROUTE_LOGIN);
  }, []);

  return <></>;
};

export default Logout;

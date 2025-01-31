import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTE_LOGIN } from '../../navigation/routes.const';
import { storageDeleteAll } from '../../utility/storage';

const Logout = () => {
  const navigate = useNavigate();
  const searchParams = window.location.search ?? '';

  useEffect(() => {
    storageDeleteAll();

    navigate(ROUTE_LOGIN + searchParams);
  }, []);

  return <></>;
};

export default Logout;

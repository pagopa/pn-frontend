import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTE_LOGIN } from '../../utils/constants';
import { storageOnSuccessOps, storageTypeOps } from '../../utils/storage';

const Logout = () => {
  const navigate = useNavigate();
  const searchParams = window.location.search ?? '';

  useEffect(() => {
    storageOnSuccessOps.delete();
    storageTypeOps.delete();

    navigate(ROUTE_LOGIN + searchParams);
  }, []);

  return <></>;
};

export default Logout;

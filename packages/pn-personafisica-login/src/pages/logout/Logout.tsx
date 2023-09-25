import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getConfiguration } from '../../services/configuration.service';
import { storageAarOps, storageOnSuccessOps, storageTypeOps } from '../../utility/storage';

const Logout = () => {
  const { ROUTE_LOGIN } = getConfiguration();
  const navigate = useNavigate();
  const searchParams = window.location.search ?? '';

  useEffect(() => {
    storageOnSuccessOps.delete();
    storageTypeOps.delete();
    storageAarOps.delete();

    navigate(ROUTE_LOGIN + searchParams);
  }, []);

  return <></>;
};

export default Logout;

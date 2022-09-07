import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTE_LOGIN } from '../../utils/constants';
import { storageOnSuccessOps, storageOriginOps } from '../../utils/storage';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    storageOnSuccessOps.delete();
    storageOriginOps.delete();
    navigate(ROUTE_LOGIN);
  }, []);

  return <></>;
};

export default Logout;

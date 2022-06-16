import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTE_LOGIN } from '../../utils/constants';
import { storageOnSuccessOps, storageTokenOps, storageUserOps } from '../../utils/storage';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    storageOnSuccessOps.delete();
    storageTokenOps.delete();
    storageUserOps.delete();
    navigate(ROUTE_LOGIN);
  }, []);

  return <></>;
};

export default Logout;

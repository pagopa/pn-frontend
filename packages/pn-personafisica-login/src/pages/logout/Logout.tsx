import { useEffect } from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';

import { ROUTE_LOGIN } from '../../utils/constants';
import { storageOnSuccessOps, storageOriginOps } from '../../utils/storage';

const Logout = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const origin = params.get('origin');



  useEffect(() => {
    storageOnSuccessOps.delete();
    storageOriginOps.delete();
    if (origin !== null && origin !== '') {
      storageOriginOps.write(origin);
    }

    navigate(ROUTE_LOGIN);
  }, []);

  return <></>;
};

export default Logout;

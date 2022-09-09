import { useEffect } from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';

import { ROUTE_LOGIN } from '../../utils/constants';
import {storageOriginOps} from "../../utils/storage";

const Logout = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();



  useEffect(() => {
    storageOriginOps.write(params.get('origin') ?? '');

    navigate(ROUTE_LOGIN);
  }, []);

  return <></>;
};

export default Logout;

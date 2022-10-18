import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { appStateSelectors, LoadingPage } from '@pagopa-pn/pn-commons';

import { useAppSelector } from '../redux/hooks';

/* eslint-disable-next-line functional/no-let */
let firstLoading = true;

const LoadingGuard = () => {
  const loading = useAppSelector(appStateSelectors.selectLoading);

  useEffect(() => {
    if (!loading) {
        firstLoading = false;
    }
  }, []);

  return (
    <>
      {(firstLoading || loading) && <LoadingPage sx={{position: 'absolute', width: '100%', zIndex: 3, backgroundColor: 'white'}}/>}
      <Outlet />
    </>
  );
};

export default LoadingGuard;

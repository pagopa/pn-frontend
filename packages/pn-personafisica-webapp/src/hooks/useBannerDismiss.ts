import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { closeDomicileBanner } from '../redux/sidemenu/reducers';
import { RootState } from '../redux/store';

const SESSION_KEY = 'domicileBannerClosed';

export const useBannerDismiss = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state: RootState) => state.generalInfoState.domicileBannerOpened);

  const handleClose = useCallback(() => {
    dispatch(closeDomicileBanner());
    sessionStorage.setItem(SESSION_KEY, 'true');
  }, [dispatch]);

  return { open, handleClose };
};

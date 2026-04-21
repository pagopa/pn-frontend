import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { Box } from '@mui/material';

import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import { contactsSelectors } from '../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setOnboardingShown } from '../redux/onboarding/reducers';

const Onboarding: React.FC = () => {
  const loading = useAppSelector(contactsSelectors.selectLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setOnboardingShown(true));
  }, [dispatch]);

  if (loading) {
    return <></>;
  }

  return (
    <LoadingPageWrapper isInitialized={true}>
      <Box display="flex" justifyContent="center">
        <Box sx={{ width: { xs: '100%', lg: '760px' } }}>
          <Outlet />
        </Box>
      </Box>
    </LoadingPageWrapper>
  );
};

export default Onboarding;

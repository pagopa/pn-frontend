import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Box } from '@mui/material';
import { ApiErrorWrapper } from '@pagopa-pn/pn-commons';

import OnboardingHome from '../components/Contacts/Onboarding/OnboardingHome';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import * as routes from '../navigation/routes.const';
import { CONTACT_ACTIONS } from '../redux/contact/actions';

const Onboarding: React.FC = () => {
  const location = useLocation();

  const isRootMode = location.pathname === routes.ONBOARDING;

  return (
    <LoadingPageWrapper isInitialized={true}>
      <ApiErrorWrapper apiId={CONTACT_ACTIONS.GET_DIGITAL_ADDRESSES}>
        <Box display="flex" justifyContent="center">
          <Box sx={{ width: { xs: '100%', lg: '760px' }, p: { xs: 2, lg: 0 } }} mt={3} mb={6}>
            {isRootMode && <OnboardingHome />}
            <Outlet />
          </Box>
        </Box>
      </ApiErrorWrapper>
    </LoadingPageWrapper>
  );
};

export default Onboarding;

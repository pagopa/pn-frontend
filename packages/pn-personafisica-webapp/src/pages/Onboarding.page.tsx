import React from 'react';
import { Outlet } from 'react-router-dom';

import { Box } from '@mui/material';
import { ApiErrorWrapper } from '@pagopa-pn/pn-commons';

import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import { CONTACT_ACTIONS } from '../redux/contact/actions';

const Onboarding: React.FC = () => (
  <LoadingPageWrapper isInitialized={true}>
    <ApiErrorWrapper apiId={CONTACT_ACTIONS.GET_DIGITAL_ADDRESSES}>
      <Box display="flex" justifyContent="center">
        <Box sx={{ width: { xs: '100%', lg: '760px' }, p: { xs: 2, lg: 0 } }} mt={3} mb={6}>
          <Outlet />
        </Box>
      </Box>
    </ApiErrorWrapper>
  </LoadingPageWrapper>
);

export default Onboarding;

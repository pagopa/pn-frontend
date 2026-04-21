import React from 'react';
import { Outlet } from 'react-router-dom';

import { Box } from '@mui/material';

import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';

const Onboarding: React.FC = () => (
  <LoadingPageWrapper isInitialized={true}>
    <Box display="flex" justifyContent="center">
      <Box sx={{ width: { xs: '100%', lg: '760px' }, p: { xs: 2, lg: 0 } }} mt={3} mb={6}>
        <Outlet />
      </Box>
    </Box>
  </LoadingPageWrapper>
);

export default Onboarding;

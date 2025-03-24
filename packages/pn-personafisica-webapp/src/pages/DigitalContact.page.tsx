import { Outlet } from 'react-router-dom';

import { Box } from '@mui/material';

import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';

const DigitalContact: React.FC = () => (
  <LoadingPageWrapper isInitialized={true}>
    <Box display="flex" justifyContent="center">
      <Box sx={{ width: { xs: '100%', lg: '760px' } }}>
        <Outlet />
      </Box>
    </Box>
  </LoadingPageWrapper>
);

export default DigitalContact;

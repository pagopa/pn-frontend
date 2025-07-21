import { Outlet } from 'react-router-dom';

import { Box } from '@mui/material';

import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import { contactsSelectors } from '../redux/contact/reducers';
import { useAppSelector } from '../redux/hooks';

const DigitalContact: React.FC = () => {
  const loading = useAppSelector(contactsSelectors.selectLoading);

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

export default DigitalContact;

import { CircularProgress, Modal } from '@mui/material';
import { Box } from '@mui/system';
import { useSelector } from 'react-redux';
import { appStateSelectors } from '../../redux';

export function LoadingOverlay() {
  const loading = useSelector(appStateSelectors.selectLoading);

  return (
    <Modal open={loading} sx={{ outline: 0 }} data-testid="loading-spinner">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100px',
          outline: 0,
        }}
      >
        <CircularProgress role="loadingSpinner" sx={{ color: 'white' }}/>
      </Box>
    </Modal>
  );
}

import { useSelector } from 'react-redux';

import { CircularProgress, Modal } from '@mui/material';
import { Box } from '@mui/system';

import { appStateSelectors } from '../../redux/slices/appStateSlice';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

export function LoadingOverlay() {
  const loading = useSelector(appStateSelectors.selectLoading);

  return (
    <Modal
      open={loading}
      sx={{ outline: 0 }}
      data-testid="loading-spinner"
      aria-live="polite"
      aria-busy={loading}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100px',
          outline: 0,
        }}
      >
        <CircularProgress
          id="spinner-loading"
          role="loadingSpinner"
          aria-label={getLocalizedOrDefaultLabel('common', 'loading')}
          sx={{ color: 'white' }}
        />
      </Box>
    </Modal>
  );
}

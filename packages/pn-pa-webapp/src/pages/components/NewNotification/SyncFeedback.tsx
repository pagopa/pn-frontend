import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { IllusCompleted } from '@pagopa/mui-italia';

import * as routes from '../../../navigation/routes.const';

const SyncFeedback = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.sync-feedback',
  });

  return (
    <Box sx={{ minHeight: '350px', height: '100%', display: 'flex' }}>
      <Box sx={{ margin: 'auto', textAlign: 'center', width: '80vw' }}>
        <IllusCompleted />
        <Typography variant="h4" color="text.primary" sx={{ margin: '20px 0 10px 0' }}>
          {t('title')}
        </Typography>
        <Typography variant="body1" color="text.primary">
          {t('message')}
        </Typography>
        <Button
          variant="contained"
          sx={{ marginTop: '30px' }}
          onClick={() => navigate(routes.DASHBOARD)}
        >
          {t('go-to-notifications')}
        </Button>
      </Box>
    </Box>
  );
};

export default SyncFeedback;

import { Alert, Typography } from '@mui/material';

import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';

const ErrorDataDrawerContent: React.FC = () => (
  <Alert severity="warning">
    <Typography fontSize="16px">
      {getLocalizedOrDefaultLabel('notifications', 'notification-alert.details.error')}
    </Typography>
  </Alert>
);

export default ErrorDataDrawerContent;

import { Alert, Typography } from '@mui/material';

import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';

const ErrorDataDrawerContent: React.FC = () => (
  <Alert severity="warning">
    <Typography fontSize="16px">
      {getLocalizedOrDefaultLabel(
        'notifications',
        'notification-alert.details.error',
        'Non siamo riusciti a recuperare i dati sui costi, riprova più tardi.'
      )}
    </Typography>
  </Alert>
);

export default ErrorDataDrawerContent;

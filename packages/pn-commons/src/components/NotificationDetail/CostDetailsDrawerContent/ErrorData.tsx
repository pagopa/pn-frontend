import { Alert, Typography } from '@mui/material';

const ErrorDataDrawerContent: React.FC = () => (
  <Alert severity="warning">
    <Typography fontSize="16px">
      Non siamo riusciti a recuperare i dati sui costi, riprova più tardi.
    </Typography>
  </Alert>
);

export default ErrorDataDrawerContent;

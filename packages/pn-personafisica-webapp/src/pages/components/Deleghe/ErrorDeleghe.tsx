import { Grid, Typography, Box, Alert } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useTranslation } from 'react-i18next';

class ErrorDelega {
  title: string;
  description: string;
  constructor(title: string, description: string) {
    this.title = title;
    this.description = description;
  }
}

type ErrorDelegheProps = {
  errorType: number;
};

const ErrorDeleghe: React.FC<ErrorDelegheProps> = ({ errorType }) => {
  const { t } = useTranslation(['deleghe']);

  const errors = [
    new ErrorDelega(t('nuovaDelega.error.noConnection'), t('nuovaDelega.error.noConnectionDescr')),
    new ErrorDelega(
      t('nuovaDelega.error.existingDelegation'),
      t('nuovaDelega.error.existingDelegationDescr')
    ),
    new ErrorDelega(t('nuovaDelega.error.notAvailable'), t('nuovaDelega.error.notAvailableDescr')),
  ];

  return (
    <Box>
      <Alert
        className="userToast"
        icon={<ErrorOutlineIcon sx={{ my: 'auto', color: 'black' }} />}
        sx={{
          width: '480px',
          height: '104px',
          backgroundColor: 'white',
          borderRadius: '5px',
          borderLeft: 'red',
          borderStyle: 'solid',
          borderWidth: '0px',
          borderLeftWidth: '4px',
          boxShadow: '0px 0px 45px rgba(0, 0, 0, 0.1) ',
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: '600' }}>{errors[errorType].title}</Typography>
            <Typography>{errors[errorType].description}</Typography>
          </Grid>
        </Grid>
      </Alert>
    </Box>
  );
};

export default ErrorDeleghe;

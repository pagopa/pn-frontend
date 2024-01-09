import { Box, Button, Stack, Typography,  } from '@mui/material';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';

// import { IllusError } from '@pagopa/mui-italia';
import Icon from '../assets/question.svg';

type Props = {
  isLogged: boolean;
  goToLogin: () => void;
  goToHomePage: () => void;
  message?: string;
  subtitle?: string;
  qrError?: boolean
};

const AccessDenied: React.FC<Props> = ({
  isLogged,
  goToLogin,
  goToHomePage,
  message,
  subtitle,
  qrError
}) => {
  const finalMessage =
    message ??
    getLocalizedOrDefaultLabel(
      'common',
      isLogged ? 'access-denied' : 'not-logged',
      'Non hai le autorizzazioni necessarie per accedere a questa pagina'
    );
  const finalSubTitle =
    subtitle ?? (isLogged ? '' : getLocalizedOrDefaultLabel('common', 'not-logged-subtitle', ''));

  return (
    <Stack
      direction="column"
      alignItems="center"
      my={6}
      px={4}
      sx={{ minHeight: '50vh'}}
      data-testid="access-denied"
    >
      {qrError && <Box mt={9}>
        <img src={qrError ? Icon : ''} alt={qrError ? 'icona di domanda' : ''} width={60}/>
      </Box>}
      
      <Box mt={2}>
        <Typography align="center" color="text.primary" variant="h4" id="login-page-title">
          {finalMessage}
        </Typography>
      </Box>
      <Box my={2} maxWidth={700}>
        <Typography align="center" color="text.primary" variant="body1">
          {finalSubTitle}
        </Typography>
      </Box>

      <Box my={4}>
        <Button
          id="login-button"
          variant="contained"
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            isLogged ? goToHomePage() : goToLogin();
          }}
        >
          {isLogged
            ? getLocalizedOrDefaultLabel('common', 'button.go-to-home', 'Vai alla homepage')
            : getLocalizedOrDefaultLabel('common', 'button.go-to-login', 'Accedi')}
        </Button>
      </Box>
    </Stack>
  );
};
export default AccessDenied;

import { Box, Button, Stack, Typography } from '@mui/material';

import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';

type Props = {
  isLogged: boolean;
  goToLogin: () => void;
  goToHomePage: () => void;
  message?: string;
  subtitle?: string;
  icon?: JSX.Element;
};

const AccessDenied: React.FC<Props> = ({
  isLogged,
  goToLogin,
  goToHomePage,
  message,
  subtitle,
  icon,
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

  console.log('TMP - Force build');

  return (
    <Stack
      direction="column"
      alignItems="center"
      my={4}
      px={4}
      sx={{ minHeight: '50vh' }}
      data-testid="access-denied"
    >
      {icon && <Box mt={11}>{icon}</Box>}

      <Typography
        align="center"
        color="text.primary"
        variant="h4"
        id="login-page-title"
        component="h1"
        mt={2}
      >
        {finalMessage}
      </Typography>

      <Typography align="center" color="text.primary" variant="body1" my={2} maxWidth={700}>
        {finalSubTitle}
      </Typography>

      <Button
        id="login-button"
        variant="contained"
        onClick={isLogged ? goToHomePage : goToLogin}
        sx={{ my: 4 }}
      >
        {isLogged
          ? getLocalizedOrDefaultLabel('common', 'button.go-to-home', 'Vai alla homepage')
          : getLocalizedOrDefaultLabel('common', 'button.go-to-login', 'Accedi')}
      </Button>
    </Stack>
  );
};
export default AccessDenied;

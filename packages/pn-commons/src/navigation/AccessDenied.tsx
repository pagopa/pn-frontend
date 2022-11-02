import { Box, Button, Stack, Typography } from '@mui/material';

import { getLocalizedOrDefaultLabel } from '../services/localization.service';

type Props = {
  isLogged: boolean;
  goToLogin: () => void;
  goToHomePage: () => void;
};

const AccessDenied = ({ isLogged, goToLogin, goToHomePage }: Props) => {
  const message = isLogged ? 'access-denied' : 'not-logged';
  const subTitle = isLogged ? '' : 'not-logged-subtitle';

  return (
    <Stack direction="column" alignItems="center" my={4} sx={{ minHeight: '50vh' }}>
      <Box mt={4}>
        <Typography align="center" color="text.primary" variant="h4">
          {getLocalizedOrDefaultLabel(
            'common',
            message,
            'Non hai le autorizzazioni necessarie per accedere a questa pagina'
          )}
        </Typography>
      </Box>
      <Box my={2}>
        <Typography align="center" color="text.primary" variant="body1">
          {getLocalizedOrDefaultLabel('common', subTitle, '')}
        </Typography>
      </Box>

      <Box my={4}>
        <Button
          variant="contained"
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            isLogged ? goToHomePage() : goToLogin();
          }}
        >
          {isLogged
            ? getLocalizedOrDefaultLabel('common', 'button.go-to-home', 'Vai alla home page')
            : getLocalizedOrDefaultLabel('common', 'button.go-to-login', 'Accedi')}
        </Button>
      </Box>
    </Stack>
  );
};
export default AccessDenied;

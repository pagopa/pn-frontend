import { Box, Button, Stack, Typography } from '@mui/material';
import { IllusError } from '@pagopa/mui-italia';

import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';

type Props = {
  isLogged?: boolean;
  goBackAction: () => void;
};

const NotFound: React.FC<Props> = ({ isLogged = true, goBackAction }) => (
  <Stack
    direction="column"
    alignItems="center"
    my={4}
    px={4}
    sx={{ minHeight: '50vh' }}
    data-testid="not-found"
  >
    <Box mt={11}>
      <IllusError />
    </Box>

    <Typography
      align="center"
      color="text.primary"
      variant="h4"
      component="h1"
      mt={2}
      data-testid="not-found-title"
    >
      {getLocalizedOrDefaultLabel('common', 'not-found.title', 'Quello che cercavi non è qui.')}
    </Typography>

    <Typography
      align="center"
      color="text.primary"
      variant="body1"
      my={2}
      maxWidth={700}
      data-testid="not-found-description"
    >
      {getLocalizedOrDefaultLabel(
        'common',
        'not-found.description',
        'La pagina che hai tentato di raggiungere non esiste o non è più disponibile.'
      )}
    </Typography>

    <Button
      variant="contained"
      onClick={goBackAction}
      sx={{ my: 4 }}
      data-testid="not-found-back-button"
    >
      {isLogged
        ? getLocalizedOrDefaultLabel('common', 'not-found.back-to-home', 'Torna alla home')
        : getLocalizedOrDefaultLabel('common', 'button.go-to-login', 'Accedi')}
    </Button>
  </Stack>
);
export default NotFound;

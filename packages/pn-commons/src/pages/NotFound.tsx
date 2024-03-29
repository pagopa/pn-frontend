import { Typography } from '@mui/material';

import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';

const NotFound: React.FC = () => (
  <>
    <Typography align="center" color="textPrimary" variant="h4" data-testid="notFoundTitle">
      {getLocalizedOrDefaultLabel(
        'common',
        'not-found.title',
        '404: La pagina che stai cercando non esiste'
      )}
    </Typography>
    <Typography
      align="center"
      color="textPrimary"
      variant="subtitle2"
      data-testid="notFoundDescription"
    >
      {getLocalizedOrDefaultLabel(
        'common',
        'not-found.description',
        'Sei qui per errore, prova ad usare la navigazione.'
      )}
    </Typography>
  </>
);
export default NotFound;

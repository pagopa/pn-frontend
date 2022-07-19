import { Typography } from '@mui/material';

import { getLocalizedOrDefaultLabel } from '../services/localization.service';

const NotFound = () => (
  <div>
    <Typography align="center" color="textPrimary" variant="h4">
      {getLocalizedOrDefaultLabel('common', 'not-found.title', '404: La pagina che stai cercando non esiste')}
    </Typography>
    <Typography align="center" color="textPrimary" variant="subtitle2">
      {getLocalizedOrDefaultLabel('common', 'not-found.description', 'Sei qui per errore, prova ad usare la navigazione.')}
    </Typography>
  </div>
);
export default NotFound;

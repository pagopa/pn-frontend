import { Fragment } from 'react';
import { Typography } from '@mui/material';

import { getLocalizedOrDefaultLabel } from '../services/localization.service';

const AccessDenied = () => (
  <Fragment>
    <Typography align="center" color="textPrimary" variant="h4">
      {getLocalizedOrDefaultLabel('common', 'access-denied', 'Non hai le autorizzazioni necessarie per accedere a questa pagina')}
    </Typography>
  </Fragment>
);
export default AccessDenied;

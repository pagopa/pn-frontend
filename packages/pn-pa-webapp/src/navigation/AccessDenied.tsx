import { Typography } from '@mui/material';
import { Fragment } from 'react';

const AccessDenied = () => (
  <Fragment>
    <Typography align="center" color="textPrimary" variant="h1">
      Non hai le autorizzazioni necessarie per accedere a questa pagina
    </Typography>
  </Fragment>
);
export default AccessDenied;

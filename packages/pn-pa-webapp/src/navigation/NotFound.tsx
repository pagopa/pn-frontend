import { Typography } from '@mui/material';

const NotFound = () => (
  <div>
    <Typography align="center" color="textPrimary" variant="h1">
      404: La pagina che stai cercando non esiste
    </Typography>
    <Typography align="center" color="textPrimary" variant="subtitle2">
      You either tried some shady route or you came here by mistake. Whichever it is, try using the
      navigation
    </Typography>
  </div>
);
export default NotFound;

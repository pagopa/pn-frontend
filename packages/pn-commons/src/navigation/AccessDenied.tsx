import { Box, Button, Stack, Typography } from '@mui/material';

import { getLocalizedOrDefaultLabel } from '../services/localization.service';


type Props = {
  isLogged: boolean;
  goToLogin: () => void;
  goToHomePage: () => void;
};

const AccessDenied = ({ isLogged, goToLogin, goToHomePage }: Props) => (
  <Stack direction="column" alignItems="center" my={4}>
    <Typography color="textPrimary" variant="h4">
      {getLocalizedOrDefaultLabel('common', 'access-denied', 'Non hai le autorizzazioni necessarie per accedere a questa pagina')}
    </Typography>
    <Box my={4}>
        <Button
          variant="contained"
          onClick={() => { isLogged ? goToHomePage() : goToLogin() }}
        >
          { isLogged 
            ? getLocalizedOrDefaultLabel('common', 'button.go-to-home', 'Torna alla home page ...') 
            : getLocalizedOrDefaultLabel('common', 'button.go-to-login', 'Procedi al login ...') 
          }
        </Button>      
    </Box>
  </Stack>
);
export default AccessDenied;

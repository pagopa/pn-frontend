import { Box, Button, Typography } from "@mui/material";

import { getLocalizedOrDefaultLabel } from "../services/localization.service";

const AppNotAccessible = () => {
    return (
        <Box sx={{ minHeight: '350px', height: '100%', display: 'flex' }}>
          <Box sx={{ margin: 'auto', textAlign: 'center', width: '80vw' }}>
            {/*<IllusError />*/}
            <Typography variant="h4" color="text.primary" sx={{ margin: '20px 0 10px 0' }}>
              {getLocalizedOrDefaultLabel(
                'common',
                'error-boundary.title',
                'Qualcosa è andato storto'
              )}
            </Typography>
            <Typography variant="body1" color="text.primary">
              {getLocalizedOrDefaultLabel(
                'common',
                'error-boundary.description',
                'Non siamo riusciti a caricare la pagina. Ricaricala, oppure prova più tardi.'
              )}
            </Typography>
            <Button variant="contained" sx={{ marginTop: '30px' }}>
              {getLocalizedOrDefaultLabel(
                'common',
                'error-boundary.action',
                'Ricarica la pagina'
              )}
            </Button>
          </Box>
        </Box>
      );
}

export default AppNotAccessible;
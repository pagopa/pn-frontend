import { Typography, Box, SxProps } from '@mui/material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

import { getLocalizedOrDefaultLabel } from '../services/localization.service';

const Loading = ({sx}: {sx?: SxProps}) => {
  return (
    <Box display="flex" height="100%" sx={sx}>
      <Box m="auto" width="100%" textAlign="center">
        <HourglassBottomIcon htmlColor="#00C5CA" sx={{width: '80px', height:'80px'}}/>
        <Typography variant="h4" color="text.primary" sx={{ margin: '20px 0 10px 0' }}>
          Loading...
        </Typography>
        <Typography variant="body1" color="text.primary">
          {getLocalizedOrDefaultLabel(
            'common',
            'loading-page',
            'Stiamo caricarando la pagina. Sarà presto disponibile'
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default Loading;

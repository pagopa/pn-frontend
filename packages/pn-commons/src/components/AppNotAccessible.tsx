import { Box, Typography } from '@mui/material';
import { IllusInProgress } from '@pagopa/mui-italia';

import { getLocalizedOrDefaultLabel } from '../services/localization.service';

type Props = {
  onAssistanceClick: () => void;
};

const AppNotAccessible: React.FC<Props> = ({ onAssistanceClick }) => (
  <Box sx={{ minHeight: '350px', height: '100%', display: 'flex' }}>
    <Box sx={{ margin: 'auto', textAlign: 'center', width: '80vw' }}>
      <IllusInProgress />
      <Typography variant="h4" color="text.primary" sx={{ margin: '20px 0 10px 0' }}>
        {getLocalizedOrDefaultLabel(
          'common',
          'not-accessible.title',
          'Non è possibile accedere alla piattaforma'
        )}
      </Typography>
      <Typography variant="body1" color="text.primary" display="inline">
        {getLocalizedOrDefaultLabel(
          'common',
          'not-accessible.description',
          'Riprova tra qualche ora. Se hai bisogno di assistenza'
        )}
      </Typography>
      &nbsp;
      <Typography
        variant="body1"
        color="primary"
        display="inline"
        fontWeight="700"
        sx={{ cursor: 'pointer', textDecoration: 'underline' }}
        onClick={onAssistanceClick}
        data-testid="assistance-button"
      >
        {`${getLocalizedOrDefaultLabel('common', 'not-accessible.action', 'scrivici')}.`}
      </Typography>
    </Box>
  </Box>
);

export default AppNotAccessible;
